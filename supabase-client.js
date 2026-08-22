/* ============================================================
   PLAYR — Supabase client + API layer
   Load supabase-js v2 BEFORE this file:
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   ============================================================ */

const SUPABASE_URL = window.PLAYR_ENV?.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = window.PLAYR_ENV?.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

const supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

/* ============================================================
   Small helpers
   ============================================================ */
function requireUser() {
  const u = PLAYR.currentUser;
  if (!u) throw new Error('Not signed in');
  return u;
}
async function currentUserId() {
  const { data } = await supa.auth.getUser();
  return data?.user?.id || null;
}

const PLAYR = {
  currentUser: null,   // auth.users user object
  currentProfile: null // profiles row
};

/* ============================================================
   1. AUTH
   ============================================================ */
const Auth = {
  async signUp({ email, password, username, displayName }) {
    const { data, error } = await supa.auth.signUp({
      email, password,
      options: { data: { username, display_name: displayName || username } }
    });
    if (error) throw error;
    return data; // profile row is auto-created by the handle_new_user trigger
  },

  async signIn({ email, password }) {
    const { data, error } = await supa.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supa.auth.signOut();
    if (error) throw error;
  },

  async sendPasswordReset(email) {
    const { error } = await supa.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname + '?reset=1'
    });
    if (error) throw error;
  },

  async updatePassword(newPassword) {
    const { error } = await supa.auth.updateUser({ password: newPassword });
    if (error) throw error;
  },

  async getSession() {
    const { data } = await supa.auth.getSession();
    return data?.session || null;
  },

  onChange(callback) {
    return supa.auth.onAuthStateChange((event, session) => callback(event, session));
  }
};

/* ============================================================
   2. PROFILE
   ============================================================ */
const Profiles = {
  async get(userId) {
    const { data, error } = await supa.from('profiles').select('*').eq('id', userId).single();
    if (error) throw error;
    return data;
  },

  async updateOwn(fields) {
    const uid = requireUser().id;
    const { data, error } = await supa.from('profiles').update(fields).eq('id', uid).select().single();
    if (error) throw error;
    return data;
  },

  async uploadAvatar(file) {
    const uid = requireUser().id;
    const path = `${uid}/avatar-${Date.now()}.${file.name.split('.').pop()}`;
    const { error: upErr } = await supa.storage.from('profile-images').upload(path, file, { upsert: true });
    if (upErr) throw upErr;
    const { data } = supa.storage.from('profile-images').getPublicUrl(path);
    await Profiles.updateOwn({ avatar_url: data.publicUrl });
    return data.publicUrl;
  },

  async search(query) {
    const { data, error } = await supa.from('profiles')
      .select('*').or(`username.ilike.%${query}%,display_name.ilike.%${query}%`).limit(20);
    if (error) throw error;
    return data;
  }
};

/* ============================================================
   3 & 4. SPORTS + USER_SPORTS (follow/unfollow)
   ============================================================ */
const Sports = {
  async list() {
    const { data, error } = await supa.from('sports').select('*').order('follower_count', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getUserSportIds(userId) {
    const { data, error } = await supa.from('user_sports').select('sport_id').eq('user_id', userId);
    if (error) throw error;
    return new Set((data || []).map(r => r.sport_id));
  },

  async follow(sportId) {
    const uid = requireUser().id;
    const { error } = await supa.from('user_sports').insert({ user_id: uid, sport_id: sportId });
    if (error) throw error;
  },

  async unfollow(sportId) {
    const uid = requireUser().id;
    const { error } = await supa.from('user_sports').delete().eq('user_id', uid).eq('sport_id', sportId);
    if (error) throw error;
  }
};

/* ============================================================
   5. POSTS
   ============================================================ */
const Posts = {
  async uploadMedia(file) {
    const uid = requireUser().id;
    const path = `${uid}/${Date.now()}-${file.name}`;
    const { error } = await supa.storage.from('post-media').upload(path, file);
    if (error) throw error;
    const { data } = supa.storage.from('post-media').getPublicUrl(path);
    return data.publicUrl;
  },

  async create({ sportId, caption, file, communityId = null }) {
    const uid = requireUser().id;
    let mediaUrl = null;
    if (file) mediaUrl = await Posts.uploadMedia(file);
    const { data, error } = await supa.from('posts')
      .insert({ user_id: uid, sport_id: sportId, caption, media_url: mediaUrl, community_id: communityId })
      .select().single();
    if (error) throw error;
    return data;
  },

  async delete(postId) {
    const uid = requireUser().id;
    const { error } = await supa.from('posts').delete().eq('id', postId).eq('user_id', uid);
    if (error) throw error;
  },

  // feedType: 'foryou' | 'following' | 'trending'
  async feed(feedType = 'foryou', limit = 20) {
    const uid = await currentUserId();
    let query = supa.from('posts')
      .select('*, profiles:user_id(username,display_name,avatar_url), sports:sport_id(name)')
      .order('created_at', { ascending: false }).limit(limit);

    if (feedType === 'trending') {
      query = supa.from('posts')
        .select('*, profiles:user_id(username,display_name,avatar_url), sports:sport_id(name)')
        .order('like_count', { ascending: false }).limit(limit);
    } else if (feedType === 'following' && uid) {
      const { data: followed } = await supa.from('follows').select('following_id').eq('follower_id', uid);
      const ids = (followed || []).map(f => f.following_id);
      if (ids.length === 0) return [];
      query = supa.from('posts')
        .select('*, profiles:user_id(username,display_name,avatar_url), sports:sport_id(name)')
        .in('user_id', ids).order('created_at', { ascending: false }).limit(limit);
    } else if (feedType === 'foryou' && uid) {
      const sportIds = Array.from(await Sports.getUserSportIds(uid));
      if (sportIds.length > 0) {
        query = supa.from('posts')
          .select('*, profiles:user_id(username,display_name,avatar_url), sports:sport_id(name)')
          .in('sport_id', sportIds).order('created_at', { ascending: false }).limit(limit);
      }
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async byCommunity(communityId) {
    const { data, error } = await supa.from('posts')
      .select('*, profiles:user_id(username,display_name,avatar_url)')
      .eq('community_id', communityId).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
};

/* ============================================================
   6. FOLLOWS (user -> user)
   ============================================================ */
const Follows = {
  async follow(userId) {
    const uid = requireUser().id;
    const { error } = await supa.from('follows').insert({ follower_id: uid, following_id: userId });
    if (error) throw error;
  },
  async unfollow(userId) {
    const uid = requireUser().id;
    const { error } = await supa.from('follows').delete().eq('follower_id', uid).eq('following_id', userId);
    if (error) throw error;
  },
  async isFollowing(userId) {
    const uid = await currentUserId();
    if (!uid) return false;
    const { data } = await supa.from('follows').select('*').eq('follower_id', uid).eq('following_id', userId).maybeSingle();
    return !!data;
  },
  async followers(userId) {
    const { data, error } = await supa.from('follows').select('follower_id, profiles:follower_id(username,display_name,avatar_url)').eq('following_id', userId);
    if (error) throw error;
    return data;
  },
  async following(userId) {
    const { data, error } = await supa.from('follows').select('following_id, profiles:following_id(username,display_name,avatar_url)').eq('follower_id', userId);
    if (error) throw error;
    return data;
  }
};

/* ============================================================
   7. LIKES
   ============================================================ */
const Likes = {
  async like(postId) {
    const uid = requireUser().id;
    const { error } = await supa.from('likes').insert({ user_id: uid, post_id: postId });
    if (error) throw error;
  },
  async unlike(postId) {
    const uid = requireUser().id;
    const { error } = await supa.from('likes').delete().eq('user_id', uid).eq('post_id', postId);
    if (error) throw error;
  },
  async hasLiked(postId) {
    const uid = await currentUserId();
    if (!uid) return false;
    const { data } = await supa.from('likes').select('*').eq('user_id', uid).eq('post_id', postId).maybeSingle();
    return !!data;
  }
};

/* ============================================================
   8. COMMENTS
   ============================================================ */
const Comments = {
  async add(postId, text) {
    const uid = requireUser().id;
    const { data, error } = await supa.from('comments')
      .insert({ post_id: postId, user_id: uid, comment: text })
      .select('*, profiles:user_id(username,display_name,avatar_url)').single();
    if (error) throw error;
    return data;
  },
  async list(postId) {
    const { data, error } = await supa.from('comments')
      .select('*, profiles:user_id(username,display_name,avatar_url)')
      .eq('post_id', postId).order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  },
  async delete(commentId) {
    const uid = requireUser().id;
    const { error } = await supa.from('comments').delete().eq('id', commentId).eq('user_id', uid);
    if (error) throw error;
  }
};

/* ============================================================
   9. COMMUNITIES
   ============================================================ */
const Communities = {
  async list() {
    const { data, error } = await supa.from('communities').select('*').order('member_count', { ascending: false });
    if (error) throw error;
    return data;
  },
  async create({ name, description, sportId, imageFile }) {
    const uid = requireUser().id;
    let imageUrl = null;
    if (imageFile) {
      const path = `${uid}/${Date.now()}-${imageFile.name}`;
      const { error: upErr } = await supa.storage.from('community-images').upload(path, imageFile);
      if (upErr) throw upErr;
      imageUrl = supa.storage.from('community-images').getPublicUrl(path).data.publicUrl;
    }
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const { data, error } = await supa.from('communities')
      .insert({ name, description, sport_id: sportId, image_url: imageUrl, created_by: uid, slug })
      .select().single();
    if (error) throw error;
    return data; // creator auto-joins via DB trigger
  },
  async join(communityId) {
    const uid = requireUser().id;
    const { error } = await supa.from('community_members').insert({ community_id: communityId, user_id: uid });
    if (error) throw error;
  },
  async leave(communityId) {
    const uid = requireUser().id;
    const { error } = await supa.from('community_members').delete().eq('community_id', communityId).eq('user_id', uid);
    if (error) throw error;
  },
  async isMember(communityId) {
    const uid = await currentUserId();
    if (!uid) return false;
    const { data } = await supa.from('community_members').select('*').eq('community_id', communityId).eq('user_id', uid).maybeSingle();
    return !!data;
  },
  async members(communityId) {
    const { data, error } = await supa.from('community_members')
      .select('*, profiles:user_id(username,display_name,avatar_url)').eq('community_id', communityId);
    if (error) throw error;
    return data;
  },
  async feed(communityId) {
    return Posts.byCommunity(communityId);
  },
  async post(communityId, { caption, file, sportId = null }) {
    return Posts.create({ sportId, caption, file, communityId });
  }
};

/* ============================================================
   10. CHALLENGES
   ============================================================ */
const Challenges = {
  async create({ title, description, sportId, unit = 'time', targetValue, opponentId = null }) {
    const uid = requireUser().id;
    const { data, error } = await supa.from('challenges')
      .insert({ creator_id: uid, opponent_id: opponentId, sport_id: sportId, title, description, unit, target_value: targetValue })
      .select().single();
    if (error) throw error;
    return data;
  },
  async challengeFriend(opponentId, details) {
    return Challenges.create({ ...details, opponentId });
  },
  async accept(challengeId) {
    const { data, error } = await supa.from('challenges').update({ status: 'accepted' }).eq('id', challengeId).select().single();
    if (error) throw error;
    return data;
  },
  async decline(challengeId) {
    const { error } = await supa.from('challenges').update({ status: 'declined' }).eq('id', challengeId);
    if (error) throw error;
  },
  async submitResult({ challengeId, resultValue, resultDisplay }) {
    const uid = requireUser().id;
    const { data, error } = await supa.from('challenge_results')
      .insert({ challenge_id: challengeId, user_id: uid, result_value: resultValue, result_display: resultDisplay })
      .select().single();
    if (error) throw error;
    await supa.from('challenges').update({ status: 'completed' }).eq('id', challengeId);
    return data;
  },
  async leaderboard(challengeId) {
    const { data, error } = await supa.from('challenge_results')
      .select('*, profiles:user_id(username,display_name,avatar_url)')
      .eq('challenge_id', challengeId).order('result_value', { ascending: true });
    if (error) throw error;
    return data;
  },
  async myChallenges() {
    const uid = requireUser().id;
    const { data, error } = await supa.from('challenges')
      .select('*, creator:creator_id(username,display_name,avatar_url), opponent:opponent_id(username,display_name,avatar_url)')
      .or(`creator_id.eq.${uid},opponent_id.eq.${uid}`).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  async listBySport(sportId) {
    const { data, error } = await supa.from('challenges').select('*').eq('sport_id', sportId).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
};

/* ============================================================
   11. EVENTS
   ============================================================ */
const Events = {
  async list() {
    const { data, error } = await supa.from('events').select('*').order('start_date', { ascending: true });
    if (error) throw error;
    return data;
  },
  async get(eventId) {
    const { data, error } = await supa.from('events').select('*').eq('id', eventId).single();
    if (error) throw error;
    return data;
  },
  async follow(eventId) {
    const uid = requireUser().id;
    const { error } = await supa.from('event_follows').insert({ event_id: eventId, user_id: uid });
    if (error) throw error;
  },
  async unfollow(eventId) {
    const uid = requireUser().id;
    const { error } = await supa.from('event_follows').delete().eq('event_id', eventId).eq('user_id', uid);
    if (error) throw error;
  },
  async register(eventId) {
    const uid = requireUser().id;
    const { error } = await supa.from('event_registrations').insert({ event_id: eventId, user_id: uid });
    if (error) throw error;
  },
  async unregister(eventId) {
    const uid = requireUser().id;
    const { error } = await supa.from('event_registrations').delete().eq('event_id', eventId).eq('user_id', uid);
    if (error) throw error;
  },
  async isRegistered(eventId) {
    const uid = await currentUserId();
    if (!uid) return false;
    const { data } = await supa.from('event_registrations').select('*').eq('event_id', eventId).eq('user_id', uid).maybeSingle();
    return !!data;
  }
};

/* ============================================================
   12. NOTIFICATIONS  (rows are inserted server-side by triggers)
   ============================================================ */
const Notifications = {
  async list(limit = 30) {
    const uid = requireUser().id;
    const { data, error } = await supa.from('notifications')
      .select('*, actor:actor_id(username,display_name,avatar_url)')
      .eq('user_id', uid).order('created_at', { ascending: false }).limit(limit);
    if (error) throw error;
    return data;
  },
  async unreadCount() {
    const uid = await currentUserId();
    if (!uid) return 0;
    const { count, error } = await supa.from('notifications')
      .select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('is_read', false);
    if (error) throw error;
    return count || 0;
  },
  async markRead(id) {
    const { error } = await supa.from('notifications').update({ is_read: true }).eq('id', id);
    if (error) throw error;
  },
  async markAllRead() {
    const uid = requireUser().id;
    const { error } = await supa.from('notifications').update({ is_read: true }).eq('user_id', uid).eq('is_read', false);
    if (error) throw error;
  },
  // realtime subscription — call the returned unsubscribe() to stop listening
  subscribe(onInsert) {
    const uid = PLAYR.currentUser?.id;
    if (!uid) return () => {};
    const channel = supa.channel('notifications:' + uid)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${uid}` },
        payload => onInsert(payload.new))
      .subscribe();
    return () => supa.removeChannel(channel);
  }
};

/* ============================================================
   13. PLAYR+ SUBSCRIPTIONS  (demo activation, no real payment)
   ============================================================ */
const Subscriptions = {
  async get() {
    const uid = requireUser().id;
    const { data, error } = await supa.from('subscriptions').select('*').eq('user_id', uid).maybeSingle();
    if (error) throw error;
    return data;
  },
  async activateDemo() {
    const uid = requireUser().id;
    const started = new Date();
    const expires = new Date(started); expires.setFullYear(expires.getFullYear() + 1);
    const { data, error } = await supa.from('subscriptions')
      .update({ status: 'active', started_at: started.toISOString(), expires_at: expires.toISOString() })
      .eq('user_id', uid).select().single();
    if (error) throw error;
    await supa.from('profiles').update({ is_playr_plus: true }).eq('id', uid);
    return data;
  },
  async cancel() {
    const uid = requireUser().id;
    const { error } = await supa.from('subscriptions').update({ status: 'cancelled' }).eq('user_id', uid);
    if (error) throw error;
    await supa.from('profiles').update({ is_playr_plus: false }).eq('id', uid);
  }
};

/* ============================================================
   14. SHOP: PRODUCTS + CART
   ============================================================ */
const Shop = {
  async listProducts(category = null) {
    let q = supa.from('products').select('*').order('created_at', { ascending: false });
    if (category && category !== 'All') q = q.eq('category', category);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },
  async getCart() {
    const uid = requireUser().id;
    const { data, error } = await supa.from('cart_items').select('*, products:product_id(*)').eq('user_id', uid);
    if (error) throw error;
    return data;
  },
  async addToCart(productId, quantity = 1) {
    const uid = requireUser().id;
    const { data: existing } = await supa.from('cart_items').select('*').eq('user_id', uid).eq('product_id', productId).maybeSingle();
    if (existing) {
      return Shop.updateQuantity(productId, existing.quantity + quantity);
    }
    const { data, error } = await supa.from('cart_items').insert({ user_id: uid, product_id: productId, quantity }).select().single();
    if (error) throw error;
    return data;
  },
  async removeFromCart(productId) {
    const uid = requireUser().id;
    const { error } = await supa.from('cart_items').delete().eq('user_id', uid).eq('product_id', productId);
    if (error) throw error;
  },
  async updateQuantity(productId, quantity) {
    const uid = requireUser().id;
    if (quantity <= 0) return Shop.removeFromCart(productId);
    const { data, error } = await supa.from('cart_items').update({ quantity }).eq('user_id', uid).eq('product_id', productId).select().single();
    if (error) throw error;
    return data;
  }
};

/* ============================================================
   15. SEARCH (across sports, users, communities, events, products)
   ============================================================ */
const Search = {
  async all(query) {
    if (!query || !query.trim()) return { sports: [], users: [], communities: [], events: [], products: [] };
    const q = `%${query}%`;
    const [sports, users, communities, events, products] = await Promise.all([
      supa.from('sports').select('*').ilike('name', q).limit(8),
      supa.from('profiles').select('*').or(`username.ilike.${q},display_name.ilike.${q}`).limit(8),
      supa.from('communities').select('*').ilike('name', q).limit(8),
      supa.from('events').select('*').ilike('name', q).limit(8),
      supa.from('products').select('*').ilike('name', q).limit(8)
    ]);
    return {
      sports: sports.data || [], users: users.data || [], communities: communities.data || [],
      events: events.data || [], products: products.data || []
    };
  }
};

/* ============================================================
   16. FEED — thin wrapper re-exported for clarity
   ============================================================ */
const Feed = {
  forYou: () => Posts.feed('foryou'),
  following: () => Posts.feed('following'),
  trending: () => Posts.feed('trending')
};

/* Expose everything on one namespace for the app script */
window.PlayrAPI = {
  supa, PLAYR, Auth, Profiles, Sports, Posts, Follows, Likes, Comments,
  Communities, Challenges, Events, Notifications, Subscriptions, Shop, Search, Feed
};
