/* ============================================================
   PLAYR — App wiring (Supabase-backed)
   Same visual design & views as the original prototype.
   Loaded after supabase-client.js, which exposes window.PlayrAPI.
   ============================================================ */
const {
  supa, PLAYR, Auth, Profiles, Sports, Posts, Follows, Likes, Comments,
  Communities, Challenges, Events, Notifications, Subscriptions, Shop, Search
} = window.PlayrAPI;

/* ---------- generic modal ---------- */
function openModal(title, bodyHtml) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalContent').innerHTML = bodyHtml;
  document.getElementById('modalOverlay').classList.add('open');
}
function closeModal(e) {
  if (e && e.target && e.target.id !== 'modalOverlay' && e.type === 'click') { /* clicked inside box via stopPropagation handled elsewhere */ }
  document.getElementById('modalOverlay').classList.remove('open');
}
function fieldHTML(label, id, type = 'text', placeholder = '') {
  return `<div class="form-field"><label class="form-label">${label}</label>
    <input class="form-input" id="${id}" type="${type}" placeholder="${placeholder}"></div>`;
}

/* ---------- caches ---------- */
let sportsCache = [];
let userSportIds = new Set();
let activeFilter = 'All';
let currentFeedTab = 'foryou';

/* ============================================================
   AUTH
   ============================================================ */
function openAuthModal(mode = 'login') {
  if (mode === 'login') {
    openModal('Log in to PLAYR', `
      ${fieldHTML('Email', 'authEmail', 'email')}
      ${fieldHTML('Password', 'authPassword', 'password')}
      <button class="btn btn-primary" style="width:100%;margin-top:10px;" onclick="submitLogin()">Log In</button>
      <div style="display:flex;justify-content:space-between;margin-top:14px;font-size:13px;">
        <a onclick="openAuthModal('forgot')" style="cursor:pointer;color:var(--muted)">Forgot password?</a>
        <a onclick="openAuthModal('signup')" style="cursor:pointer;color:var(--lime)">Create account</a>
      </div>`);
  } else if (mode === 'signup') {
    openModal('Join PLAYR', `
      ${fieldHTML('Username', 'authUsername')}
      ${fieldHTML('Email', 'authEmail', 'email')}
      ${fieldHTML('Password', 'authPassword', 'password')}
      <button class="btn btn-primary" style="width:100%;margin-top:10px;" onclick="submitSignup()">Create Account</button>
      <div style="margin-top:14px;font-size:13px;text-align:center;">
        <a onclick="openAuthModal('login')" style="cursor:pointer;color:var(--muted)">Already have an account? Log in</a>
      </div>`);
  } else if (mode === 'forgot') {
    openModal('Reset your password', `
      ${fieldHTML('Email', 'authEmail', 'email')}
      <button class="btn btn-primary" style="width:100%;margin-top:10px;" onclick="submitForgot()">Send reset link</button>`);
  }
}
async function submitSignup() {
  try {
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const username = document.getElementById('authUsername').value.trim();
    if (!email || !password || !username) return showToast('Fill in all fields');
    await Auth.signUp({ email, password, username });
    showToast('Account created — check your email to confirm, then log in 🎉');
    openAuthModal('login');
  } catch (err) { showToast(err.message || 'Sign up failed'); }
}
async function submitLogin() {
  try {
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    await Auth.signIn({ email, password });
    closeModal();
    showToast('Welcome back 🎉');
  } catch (err) { showToast(err.message || 'Login failed'); }
}
async function submitForgot() {
  try {
    const email = document.getElementById('authEmail').value.trim();
    await Auth.sendPasswordReset(email);
    showToast('Reset link sent — check your email');
    closeModal();
  } catch (err) { showToast(err.message || 'Could not send reset email'); }
}
async function logout() {
  await Auth.signOut();
  showToast('Signed out');
  closeDropdowns();
}
function requireLogin() {
  if (!PLAYR.currentUser) { openAuthModal('login'); return false; }
  return true;
}

function refreshAuthUI() {
  const joinBtn = document.getElementById('joinBtn');
  const ddProfile = document.getElementById('dd-profile');
  if (PLAYR.currentUser && PLAYR.currentProfile) {
    joinBtn.textContent = 'Log Out';
    joinBtn.onclick = logout;
    const p = PLAYR.currentProfile;
    ddProfile.innerHTML = `
      <div class="dropdown-item" onclick="switchView('profile')" style="cursor:pointer;">
        <div class="dd-avatar" style="background:${p.avatar_url ? `url('${p.avatar_url}') center/cover` : 'linear-gradient(135deg,var(--lime),var(--cyan))'};"></div>
        <div><div class="dd-title">${p.display_name || p.username}</div><div class="dd-sub">View your profile</div></div>
      </div>
      <div class="dropdown-item" style="cursor:pointer;" onclick="switchView('plus')"><div><div class="dd-title">Upgrade to PLAYR+</div></div></div>
      <div class="dropdown-item" style="cursor:pointer;" onclick="logout()"><div><div class="dd-title">Log out</div></div></div>`;
  } else {
    joinBtn.textContent = 'Join PLAYR';
    joinBtn.onclick = () => openAuthModal('signup');
    ddProfile.innerHTML = `
      <div class="dropdown-item" style="cursor:pointer;" onclick="openAuthModal('login')"><div><div class="dd-title">Log in</div></div></div>
      <div class="dropdown-item" style="cursor:pointer;" onclick="openAuthModal('signup')"><div><div class="dd-title">Create account</div></div></div>`;
  }
}

/* ============================================================
   SPORTS (Discover grid + follow)
   ============================================================ */
async function loadSports() {
  sportsCache = await Sports.list();
  userSportIds = PLAYR.currentUser ? await Sports.getUserSportIds(PLAYR.currentUser.id) : new Set();
}
function renderFilters() {
  const cats = ['All', ...new Set(sportsCache.map(s => s.category).filter(Boolean))];
  document.getElementById('sportFilters').innerHTML = cats.map(f =>
    `<button class="chip ${f === activeFilter ? 'active' : ''}" onclick="setFilter('${f}')">${f}</button>`).join('');
}
function setFilter(f) { activeFilter = f; renderFilters(); renderSports(); }
function fmtFollowers(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}
function renderSports() {
  const q = (document.getElementById('sportSearch').value || '').toLowerCase();
  const grid = document.getElementById('sportGrid');
  const filtered = sportsCache.filter(s => {
    const matchQ = s.name.toLowerCase().includes(q);
    const matchF = activeFilter === 'All' || s.category === activeFilter;
    return matchQ && matchF;
  });
  document.getElementById('noSportsMsg').style.display = filtered.length ? 'none' : 'block';
  grid.innerHTML = filtered.map(s => `
    <div class="sport-card" style="background-image:url('${s.image_url || ''}')" onclick="openSport('${s.id}')">
      <div class="sport-cat pill pill-lime">${s.category || 'Sport'}</div>
      <div class="sport-card-body">
        <div class="sport-name">${s.name}</div>
        <div class="sport-followers mono-num">${fmtFollowers(s.follower_count || 0)} followers</div>
        <button class="follow-btn ${userSportIds.has(s.id) ? 'following' : ''}" onclick="event.stopPropagation(); toggleSportFollow('${s.id}', this)">${userSportIds.has(s.id) ? 'Following' : '+ Follow'}</button>
      </div>
    </div>`).join('');
  if (q.length >= 2) runGlobalSearch(q); else clearGlobalSearch();
}
async function toggleSportFollow(sportId, el) {
  if (!requireLogin()) return;
  const following = userSportIds.has(sportId);
  try {
    if (following) { await Sports.unfollow(sportId); userSportIds.delete(sportId); }
    else { await Sports.follow(sportId); userSportIds.add(sportId); }
    const sport = sportsCache.find(s => s.id === sportId);
    if (sport) sport.follower_count += following ? -1 : 1;
    el.classList.toggle('following');
    el.textContent = userSportIds.has(sportId) ? 'Following' : '+ Follow';
    showToast(userSportIds.has(sportId) ? `Following ${sport?.name}` : `Unfollowed ${sport?.name}`);
    if (document.getElementById('suFollowBtn')) syncSuFollowBtn();
  } catch (err) { showToast(err.message || 'Could not update follow'); }
}
function openSport(id) { switchView('sports'); setSportUniverse(id); }

/* ---------- Global cross-entity search (Discover) ---------- */
async function runGlobalSearch(q) {
  try {
    const results = await Search.all(q);
    const wrap = document.getElementById('searchResultsWrap');
    const sections = [
      ['Users', results.users.map(u => u.display_name || u.username)],
      ['Communities', results.communities.map(c => c.name)],
      ['Events', results.events.map(e => e.name)],
      ['Products', results.products.map(p => p.name)]
    ].filter(([, items]) => items.length);
    if (!sections.length) { wrap.style.display = 'none'; return; }
    wrap.style.display = 'block';
    wrap.innerHTML = `<div class="eyebrow" style="margin-top:30px;">Also matching “${q}”</div>` +
      sections.map(([label, items]) => `<div style="margin-bottom:10px;"><b style="font-size:13px;">${label}:</b> <span style="color:var(--muted);font-size:13px;">${items.join(', ')}</span></div>`).join('');
  } catch { /* ignore search errors */ }
}
function clearGlobalSearch() { const w = document.getElementById('searchResultsWrap'); if (w) { w.style.display = 'none'; w.innerHTML = ''; } }

/* ============================================================
   HOME FEED (posts) + comments
   ============================================================ */
function timeAgo(iso) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'now';
  if (s < 3600) return Math.floor(s / 60) + 'm';
  if (s < 86400) return Math.floor(s / 3600) + 'h';
  return Math.floor(s / 86400) + 'd';
}
function postHTML(p) {
  const author = p.profiles || {};
  const avatar = author.avatar_url || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop';
  const isMine = PLAYR.currentUser && p.user_id === PLAYR.currentUser.id;
  return `<div class="post" data-post-id="${p.id}">
    <div class="post-head">
      <div class="avatar" style="background-image:url('${avatar}')"></div>
      <div><div class="post-user">${author.display_name || author.username || 'PLAYR user'} ${p.sports?.name ? `<span class="pill pill-muted">${p.sports.name}</span>` : ''}</div><div class="post-meta">${timeAgo(p.created_at)} ago</div></div>
      ${isMine ? `<button class="follow-btn post-follow" style="padding:7px 14px;font-size:11px;background:transparent;border-color:var(--coral);color:var(--coral);" onclick="deletePostUI('${p.id}')">Delete</button>` : `<button class="follow-btn post-follow" style="padding:7px 14px;font-size:11px;" onclick="togglePostAuthorFollow('${p.user_id}', this)" id="followbtn-${p.id}">+ Follow</button>`}
    </div>
    <div class="post-body">${p.caption || ''}</div>
    ${p.media_url ? `<div class="post-media" style="background-image:url('${p.media_url}')"></div>` : ''}
    <div class="post-actions">
      <button class="pa-btn" id="like-${p.id}" onclick="togglePostLike('${p.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg><span class="likecount">${p.like_count || 0}</span></button>
      <button class="pa-btn" onclick="toggleCommentPanel('${p.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>${p.comment_count || 0}</button>
      <button class="pa-btn" onclick="showToast('Shared to your story')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>Share</button>
    </div>
    <div id="comments-${p.id}" style="display:none;padding:0 18px 16px;"></div>
  </div>`;
}
async function renderHomeFeed() {
  const el = document.getElementById('homeFeed');
  el.innerHTML = `<p style="color:var(--muted);">Loading feed…</p>`;
  try {
    const posts = await Posts.feed(currentFeedTab);
    if (!posts || !posts.length) {
      el.innerHTML = `<p style="color:var(--muted);text-align:center;padding:30px 0;">Nothing here yet — follow a sport or a friend, or be the first to post.</p>`;
      return;
    }
    el.innerHTML = posts.map(postHTML).join('');
    posts.forEach(p => { if (PLAYR.currentUser) syncLikeButton(p.id); });
  } catch (err) { el.innerHTML = `<p style="color:var(--coral);">Couldn't load the feed: ${err.message}</p>`; }
}
function setFeedTab(tab) {
  currentFeedTab = tab;
  document.querySelectorAll('.feed-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  renderHomeFeed();
}
async function syncLikeButton(postId) {
  const liked = await Likes.hasLiked(postId);
  const btn = document.getElementById('like-' + postId);
  if (btn) btn.classList.toggle('liked', liked);
}
async function togglePostLike(postId) {
  if (!requireLogin()) return;
  const btn = document.getElementById('like-' + postId);
  const countEl = btn.querySelector('.likecount');
  const liked = btn.classList.contains('liked');
  try {
    if (liked) { await Likes.unlike(postId); btn.classList.remove('liked'); countEl.textContent = Math.max(0, parseInt(countEl.textContent) - 1); }
    else { await Likes.like(postId); btn.classList.add('liked'); countEl.textContent = parseInt(countEl.textContent) + 1; }
  } catch (err) { showToast(err.message || 'Could not update like'); }
}
async function togglePostAuthorFollow(userId, el) {
  if (!requireLogin()) return;
  try {
    const following = el.classList.contains('following');
    if (following) { await Follows.unfollow(userId); el.classList.remove('following'); el.textContent = '+ Follow'; }
    else { await Follows.follow(userId); el.classList.add('following'); el.textContent = 'Following'; }
  } catch (err) { showToast(err.message || 'Could not update follow'); }
}
async function deletePostUI(postId) {
  try { await Posts.delete(postId); document.querySelector(`[data-post-id="${postId}"]`)?.remove(); showToast('Post deleted'); }
  catch (err) { showToast(err.message || 'Could not delete post'); }
}
async function toggleCommentPanel(postId) {
  const panel = document.getElementById('comments-' + postId);
  if (panel.style.display === 'block') { panel.style.display = 'none'; return; }
  panel.style.display = 'block';
  panel.innerHTML = 'Loading comments…';
  try {
    const comments = await Comments.list(postId);
    panel.innerHTML = `
      <div style="border-top:1px solid var(--line);padding-top:12px;">
        ${comments.map(c => `<div style="margin-bottom:8px;font-size:13px;"><b>${c.profiles?.display_name || c.profiles?.username || 'User'}</b> ${c.comment}</div>`).join('') || '<p style="color:var(--muted);font-size:13px;">No comments yet.</p>'}
        <div style="display:flex;gap:8px;margin-top:10px;">
          <input class="form-input" id="commentInput-${postId}" placeholder="Add a comment…" style="flex:1;">
          <button class="btn btn-primary btn-sm" onclick="submitComment('${postId}')">Post</button>
        </div>
      </div>`;
  } catch (err) { panel.innerHTML = `<p style="color:var(--coral);font-size:13px;">${err.message}</p>`; }
}
async function submitComment(postId) {
  if (!requireLogin()) return;
  const input = document.getElementById('commentInput-' + postId);
  const text = input.value.trim();
  if (!text) return;
  try {
    await Comments.add(postId, text);
    input.value = '';
    toggleCommentPanel(postId); toggleCommentPanel(postId); // refresh
    const countBadge = document.querySelector(`[data-post-id="${postId}"] .post-actions .pa-btn:nth-child(2)`);
    if (countBadge) countBadge.lastChild.textContent = (parseInt(countBadge.textContent) + 1);
  } catch (err) { showToast(err.message || 'Could not post comment'); }
}

/* ---------- Create post ---------- */
function openCreatePostModal(communityId = null) {
  if (!requireLogin()) return;
  const sportOptions = sportsCache.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  openModal(communityId ? 'Post in community' : 'Create a post', `
    <div class="form-field"><label class="form-label">Sport</label>
      <select class="form-input" id="postSport"><option value="">General</option>${sportOptions}</select></div>
    <div class="form-field"><label class="form-label">Caption</label>
      <textarea class="form-input form-textarea" id="postCaption" placeholder="What's happening in your sport?"></textarea></div>
    <div class="form-field"><label class="form-label">Photo (optional)</label>
      <input class="form-input" id="postFile" type="file" accept="image/*"></div>
    <button class="btn btn-primary" style="width:100%;margin-top:6px;" onclick="submitCreatePost(${communityId ? `'${communityId}'` : null})">Post</button>`);
}
async function submitCreatePost(communityId) {
  try {
    const sportId = document.getElementById('postSport').value || null;
    const caption = document.getElementById('postCaption').value.trim();
    const file = document.getElementById('postFile').files[0] || null;
    if (!caption && !file) return showToast('Add a caption or photo');
    await Posts.create({ sportId, caption, file, communityId });
    closeModal();
    showToast('Posted 🎉');
    if (communityId) renderCommunityFeed(communityId); else renderHomeFeed();
  } catch (err) { showToast(err.message || 'Could not create post'); }
}

/* ============================================================
   SPORT UNIVERSE (editorial content stays static; follow state is real)
   ============================================================ */
let currentSport = null; // now a sport UUID
function renderSuSwitch() {
  document.getElementById('suSwitch').innerHTML = sportsCache.slice(0, 10).map(s =>
    `<button data-sport="${s.id}" onclick="setSportUniverse('${s.id}')">${s.name}</button>`).join('');
}
function setSportUniverse(id) {
  currentSport = id;
  const s = sportsCache.find(x => x.id === id);
  if (!s) return;
  document.getElementById('suHeader').style.backgroundImage = `url('${s.image_url || ''}')`;
  document.getElementById('suFollowers').textContent = `${fmtFollowers(s.follower_count || 0)} Followers`;
  document.getElementById('suTitle').textContent = s.name;
  document.querySelectorAll('#suSwitch button').forEach(b => b.classList.toggle('active', b.dataset.sport === id));
  syncSuFollowBtn();
  setSuTab(currentSuTab);
}
function syncSuFollowBtn() {
  const btn = document.getElementById('suFollowBtn');
  if (!btn || !currentSport) return;
  const following = userSportIds.has(currentSport);
  btn.classList.toggle('following', following);
  btn.textContent = following ? 'Following' : '+ Follow';
}
const SU_TABS = ['feed', 'community', 'challenges', 'events', 'stats'];
let currentSuTab = 'feed';
function renderSuTabs() {
  document.getElementById('suTabs').innerHTML = SU_TABS.map(t =>
    `<div class="su-tab ${t === currentSuTab ? 'active' : ''}" data-sutab="${t}" onclick="setSuTab('${t}')">${t}</div>`).join('');
}
async function setSuTab(tab) {
  currentSuTab = tab;
  document.querySelectorAll('#suTabs .su-tab').forEach(t => t.classList.toggle('active', t.dataset.sutab === tab));
  const wrap = document.getElementById('suPanels');
  const s = sportsCache.find(x => x.id === currentSport);
  if (!s) return;
  if (tab === 'feed') {
    wrap.innerHTML = 'Loading…';
    const { data } = await supa.from('posts').select('*, profiles:user_id(username,display_name,avatar_url), sports:sport_id(name)').eq('sport_id', currentSport).order('created_at', { ascending: false }).limit(10);
    wrap.innerHTML = `<div class="feed-col" style="margin:0;">${(data || []).map(postHTML).join('') || `<p style="color:var(--muted);">No posts yet in ${s.name} — be the first to post.</p>`}</div>
      <button class="btn btn-ghost btn-sm" style="margin-top:14px;" onclick="openCreatePostModal()">+ Post in ${s.name}</button>`;
  } else if (tab === 'community') {
    wrap.innerHTML = `<p style="color:var(--muted);">Browse <a style="color:var(--lime);cursor:pointer;" onclick="switchView('communities')">Communities</a> for ${s.name} discussion.</p>`;
  } else if (tab === 'challenges') {
    wrap.innerHTML = 'Loading…';
    const list = await Challenges.listBySport(currentSport);
    wrap.innerHTML = list.length ? list.map(c => `<div class="card" style="padding:26px;display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;"><div><h4 style="font-size:17px;font-weight:800;margin-bottom:6px;">${c.title}</h4><p style="color:var(--muted);font-size:14px;">${c.description || ''}</p></div><button class="btn btn-primary btn-sm" onclick="switchView('challenges')">View</button></div>`).join('')
      : `<p style="color:var(--muted);">No challenges yet for ${s.name}. <a style="color:var(--lime);cursor:pointer;" onclick="switchView('challenges')">Create one</a>.</p>`;
  } else if (tab === 'events') {
    wrap.innerHTML = 'Loading…';
    const { data } = await supa.from('events').select('*').eq('sport_id', currentSport);
    wrap.innerHTML = (data || []).length ? data.map(e => `<div class="card" style="padding:26px;display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;"><div><h4 style="font-size:17px;font-weight:800;margin-bottom:6px;">${e.name}</h4><p style="color:var(--muted);font-size:14px;font-family:var(--mono);">${e.location || ''}</p></div><button class="btn btn-ghost btn-sm" onclick="switchView('events')">View Event</button></div>`).join('')
      : `<p style="color:var(--muted);">No events yet for ${s.name}.</p>`;
  } else if (tab === 'stats') {
    wrap.innerHTML = `<div class="stat-row"><div class="stat-block"><div class="flap">${fmtFollowers(s.follower_count || 0)}</div><div class="stat-label">Followers</div></div></div>`;
  }
}

/* ============================================================
   CHALLENGES
   ============================================================ */
function createChallenge() {
  if (!requireLogin()) return;
  const sportOptions = sportsCache.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  openModal('Create a challenge', `
    <div class="form-field"><label class="form-label">Sport</label><select class="form-input" id="chSport">${sportOptions}</select></div>
    ${fieldHTML('Title', 'chTitle', 'text', 'e.g. 10KM Time Challenge')}
    ${fieldHTML('Target (e.g. 10 KM, 50 reps)', 'chTarget')}
    <button class="btn btn-primary" style="width:100%;margin-top:6px;" onclick="submitCreateChallenge()">Create</button>`);
}
async function submitCreateChallenge() {
  try {
    const sportId = document.getElementById('chSport').value;
    const title = document.getElementById('chTitle').value.trim();
    const targetValue = document.getElementById('chTarget').value.trim();
    if (!title) return showToast('Give your challenge a title');
    await Challenges.create({ title, sportId, targetValue });
    closeModal();
    showToast('Challenge created — invite friends from your community');
    renderChallengeGrid();
  } catch (err) { showToast(err.message || 'Could not create challenge'); }
}
async function renderChallengeGrid() {
  const el = document.getElementById('challengeGrid');
  el.innerHTML = 'Loading…';
  const { data } = await supa.from('challenges').select('*, sports:sport_id(name,image_url)').order('created_at', { ascending: false }).limit(8);
  el.innerHTML = (data || []).map(c => `
    <div class="card" style="overflow:hidden;">
      <div style="height:130px;background-size:cover;background-position:center;background-image:url('${c.sports?.image_url || ''}')"></div>
      <div style="padding:16px 18px;">
        <div class="pill pill-muted" style="margin-bottom:10px;">${c.sports?.name || 'PLAYR'}</div>
        <div style="font-weight:800;font-size:14px;margin-bottom:14px;">${c.title}</div>
        <button class="btn btn-ghost btn-sm" style="width:100%;" onclick="challengeFriendPrompt('${c.id}')">Challenge Friend</button>
      </div>
    </div>`).join('') || `<p style="color:var(--muted);">No challenges yet — be the first to <a style="color:var(--lime);cursor:pointer;" onclick="createChallenge()">create one</a>.</p>`;
}
async function challengeFriendPrompt(challengeId) {
  if (!requireLogin()) return;
  showToast('Challenge shared with your followers');
}
async function beatChallenge() {
  if (!requireLogin()) return;
  document.getElementById('vsTimeB').textContent = 'Logged!';
  showToast('Attempt logged — submit your exact time from My Challenges');
}
async function renderLeaderboard() {
  const el = document.getElementById('leaderboardList');
  el.innerHTML = 'Loading…';
  const { data } = await supa.from('challenge_results')
    .select('*, profiles:user_id(username,display_name,avatar_url)')
    .order('result_value', { ascending: true }).limit(10);
  el.innerHTML = (data || []).map((r, i) => `
    <div class="leaderboard-row">
      <div class="lb-rank ${i === 0 ? 'gold' : ''}">${i + 1}</div>
      <div class="lb-avatar" style="background-image:url('${r.profiles?.avatar_url || ''}')"></div>
      <div class="lb-name">${r.profiles?.display_name || r.profiles?.username || 'Player'}</div>
      <div class="lb-time">${r.result_display || r.result_value}</div>
    </div>`).join('') || `<p style="color:var(--muted);padding:20px;">No results submitted yet.</p>`;
}

/* ============================================================
   COMMUNITIES
   ============================================================ */
let communityMembership = new Set();
async function renderCommunities() {
  const el = document.getElementById('communityList');
  el.innerHTML = 'Loading…';
  const list = await Communities.list();
  if (PLAYR.currentUser) {
    const { data } = await supa.from('community_members').select('community_id').eq('user_id', PLAYR.currentUser.id);
    communityMembership = new Set((data || []).map(r => r.community_id));
  }
  el.innerHTML = list.map((c, i) => `
    <div class="community-row" style="${i < list.length - 1 ? 'border-bottom:1px solid var(--line);' : ''}">
      <div class="community-icon" style="background-image:url('${c.image_url || ''}')"></div>
      <div><div class="community-name">${c.name}</div><div class="community-meta">${(c.member_count || 0).toLocaleString()} members</div></div>
      <button class="join-btn ${communityMembership.has(c.id) ? 'joined' : ''}" onclick="toggleJoin('${c.id}', this)">${communityMembership.has(c.id) ? 'Joined' : 'Join'}</button>
    </div>`).join('') || `<p style="color:var(--muted);padding:20px;">No communities yet.</p>`;
}
function openCreateCommunityModal() {
  if (!requireLogin()) return;
  const sportOptions = sportsCache.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  openModal('Create a community', `
    ${fieldHTML('Name', 'commName')}
    <div class="form-field"><label class="form-label">Sport</label><select class="form-input" id="commSport"><option value="">General</option>${sportOptions}</select></div>
    <div class="form-field"><label class="form-label">Description</label><textarea class="form-input form-textarea" id="commDesc"></textarea></div>
    <button class="btn btn-primary" style="width:100%;margin-top:6px;" onclick="submitCreateCommunity()">Create Community</button>`);
}
async function submitCreateCommunity() {
  try {
    const name = document.getElementById('commName').value.trim();
    const sportId = document.getElementById('commSport').value || null;
    const description = document.getElementById('commDesc').value.trim();
    if (!name) return showToast('Give your community a name');
    await Communities.create({ name, description, sportId });
    closeModal(); showToast('Community created 🎉'); renderCommunities();
  } catch (err) { showToast(err.message || 'Could not create community'); }
}
async function toggleJoin(communityId, btn) {
  if (!requireLogin()) return;
  try {
    const joined = communityMembership.has(communityId);
    if (joined) { await Communities.leave(communityId); communityMembership.delete(communityId); }
    else { await Communities.join(communityId); communityMembership.add(communityId); }
    btn.classList.toggle('joined');
    btn.textContent = communityMembership.has(communityId) ? 'Joined' : 'Join';
    showToast(communityMembership.has(communityId) ? 'Joined community' : 'Left community');
  } catch (err) { showToast(err.message || 'Could not update membership'); }
}
async function renderActivity() {
  const el = document.getElementById('activityList');
  if (!PLAYR.currentUser) { el.innerHTML = `<p style="color:var(--muted);font-size:13px;">Log in to see friend activity.</p>`; return; }
  el.innerHTML = 'Loading…';
  const notifs = await Notifications.list(6);
  el.innerHTML = notifs.map(n => `
    <div class="activity-item"><div class="avatar" style="width:34px;height:34px;background-image:url('${n.actor?.avatar_url || ''}')"></div>
    <div><p><b>${n.actor?.display_name || n.actor?.username || 'Someone'}</b> ${n.message}</p><div class="activity-time">${timeAgo(n.created_at)} ago</div></div></div>`).join('')
    || `<p style="color:var(--muted);font-size:13px;">No activity yet.</p>`;
}
async function renderCommunityFeed(communityId) { /* used after posting in a community; no dedicated view in this UI yet */ }

/* ============================================================
   EVENTS
   ============================================================ */
async function renderEvents() {
  const el = document.getElementById('eventsGrid');
  el.innerHTML = 'Loading…';
  const list = await Events.list();
  el.innerHTML = list.map(e => `
    <div class="card event-card">
      <div class="event-media" style="background-image:url('${e.banner_image_url || ''}')"></div>
      <div class="event-body">
        <div class="pill pill-cyan" style="margin-bottom:10px;">Event</div>
        <div class="event-name">${e.name}</div>
        <div class="event-meta-row"><span>📅 ${e.start_date ? new Date(e.start_date).toLocaleDateString() : 'TBA'}</span><span>📍 ${e.location || 'TBA'}</span></div>
        <div class="event-actions">
          <button class="btn btn-primary btn-sm" onclick="registerForEvent('${e.id}', this)">Register</button>
          <button class="btn btn-ghost btn-sm" onclick="followEventUI('${e.id}', this)">Follow</button>
        </div>
      </div>
    </div>`).join('') || `<p style="color:var(--muted);">No events yet.</p>`;
}
async function registerForEvent(eventId, btn) {
  if (!requireLogin()) return;
  try {
    const already = await Events.isRegistered(eventId);
    if (already) { await Events.unregister(eventId); btn.textContent = 'Register'; showToast('Registration cancelled'); }
    else { await Events.register(eventId); btn.textContent = 'Registered'; showToast('Registered — see you there!'); }
  } catch (err) { showToast(err.message || 'Could not register'); }
}
async function followEventUI(eventId, btn) {
  if (!requireLogin()) return;
  try { await Events.follow(eventId); showToast('Following this event'); }
  catch (err) { showToast(err.message || 'Could not follow event'); }
}

/* ============================================================
   NOTIFICATIONS
   ============================================================ */
let notifUnsub = null;
async function refreshNotifDropdown() {
  const el = document.getElementById('dd-notif-body');
  const dot = document.getElementById('notifBadge');
  if (!PLAYR.currentUser) { el.innerHTML = `<div class="dropdown-item"><div><div class="dd-title">Log in to see notifications</div></div></div>`; dot.style.display = 'none'; return; }
  const notifs = await Notifications.list(8);
  const unread = await Notifications.unreadCount();
  dot.style.display = unread > 0 ? 'block' : 'none';
  el.innerHTML = notifs.map(n => `
    <div class="dropdown-item"><div class="dd-avatar" style="background:${n.actor?.avatar_url ? `url('${n.actor.avatar_url}') center/cover` : 'linear-gradient(135deg,var(--lime),var(--cyan))'};"></div>
    <div><div class="dd-title">${n.actor?.display_name || n.actor?.username || 'PLAYR'} ${n.message}</div><div class="dd-sub">${timeAgo(n.created_at)} ago</div></div></div>`).join('')
    || `<div class="dropdown-item"><div><div class="dd-title">No notifications yet</div></div></div>`;
}
function setupNotificationRealtime() {
  if (notifUnsub) notifUnsub();
  notifUnsub = Notifications.subscribe(() => { document.getElementById('notifBadge').style.display = 'block'; refreshNotifDropdown(); });
}

/* ============================================================
   PLAYR+
   ============================================================ */
async function activatePlayrPlus() {
  if (!requireLogin()) return;
  try { await Subscriptions.activateDemo(); showToast('Welcome to PLAYR+ ⚡ (demo activation — no real payment)'); }
  catch (err) { showToast(err.message || 'Could not activate PLAYR+'); }
}

/* ============================================================
   SHOP
   ============================================================ */
let shopCatsCache = ['All'];
let shopFilter = 'All';
let productsCache = [];
async function renderShopFilters() {
  productsCache = await Shop.listProducts();
  shopCatsCache = ['All', ...new Set(productsCache.map(p => p.category).filter(Boolean))];
  document.getElementById('shopFilters').innerHTML = shopCatsCache.map(c =>
    `<button class="chip ${c === shopFilter ? 'active' : ''}" onclick="setShopFilter('${c}')">${c}</button>`).join('');
}
function setShopFilter(c) { shopFilter = c; renderShopFilters().then(() => { renderShop(); renderMerch(); }); }
function renderShop() {
  const list = productsCache.filter(p => p.category !== 'Merch' && (shopFilter === 'All' || p.category === shopFilter));
  document.getElementById('shopGrid').innerHTML = list.map(p => `
    <div class="card product-card">
      <div class="product-media" style="background-image:url('${p.image_url || ''}')"></div>
      <div class="product-body">
        <div class="product-cat">${p.category || ''}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-row"><span class="product-price">₹${Number(p.price).toLocaleString('en-IN')}</span><button class="btn btn-primary btn-sm" onclick="addToCartUI('${p.id}')">Add to Cart</button></div>
      </div>
    </div>`).join('');
}
function renderMerch() {
  const list = productsCache.filter(p => p.category === 'Merch');
  document.getElementById('merchGrid').innerHTML = list.map(p => `
    <div class="card product-card">
      <div class="product-media" style="background-image:url('${p.image_url || ''}')"></div>
      <div class="product-body">
        <div class="product-cat">PLAYR Merch</div>
        <div class="product-name">${p.name}</div>
        <div class="product-row"><span class="product-price">₹${Number(p.price).toLocaleString('en-IN')}</span><button class="btn btn-ghost btn-sm" onclick="addToCartUI('${p.id}')">Add to Cart</button></div>
      </div>
    </div>`).join('');
}
let dropClaimed = 5;
function claimDrop() {
  dropClaimed++;
  document.getElementById('dropClaimed').textContent = String(dropClaimed).padStart(2, '0');
  showToast('Drop claimed — check your cart 🏃');
}
async function addToCartUI(productId) {
  if (!requireLogin()) return;
  try { await Shop.addToCart(productId, 1); showToast('Added to cart'); updateCartBadge(); }
  catch (err) { showToast(err.message || 'Could not add to cart'); }
}
async function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (!PLAYR.currentUser) { badge.style.display = 'none'; return; }
  const items = await Shop.getCart();
  const count = items.reduce((n, i) => n + i.quantity, 0);
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}
async function openCartModal() {
  if (!requireLogin()) return;
  const items = await Shop.getCart();
  const total = items.reduce((sum, i) => sum + i.quantity * Number(i.products.price), 0);
  openModal('Your Cart', items.length ? `
    ${items.map(i => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--line);">
        <div>
          <div style="font-weight:700;font-size:13px;">${i.products.name}</div>
          <div style="font-size:12px;color:var(--muted);">₹${Number(i.products.price).toLocaleString('en-IN')} × ${i.quantity}</div>
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          <button class="btn btn-ghost btn-sm" onclick="changeCartQty('${i.product_id}', ${i.quantity - 1})">−</button>
          <span>${i.quantity}</span>
          <button class="btn btn-ghost btn-sm" onclick="changeCartQty('${i.product_id}', ${i.quantity + 1})">+</button>
        </div>
      </div>`).join('')}
    <div style="display:flex;justify-content:space-between;margin-top:16px;font-weight:800;">
      <span>Total</span><span>₹${total.toLocaleString('en-IN')}</span>
    </div>
    <p style="color:var(--muted);font-size:12px;margin-top:10px;">Checkout / payments aren't implemented in this MVP.</p>
  ` : `<p style="color:var(--muted);">Your cart is empty.</p>`);
}
async function changeCartQty(productId, qty) {
  try { await Shop.updateQuantity(productId, qty); openCartModal(); updateCartBadge(); }
  catch (err) { showToast(err.message || 'Could not update cart'); }
}

/* ============================================================
   PROFILE (real logged-in user)
   ============================================================ */
async function renderProfile() {
  const wrap = document.getElementById('profile-athlete');
  if (!PLAYR.currentUser) {
    wrap.innerHTML = `<div style="padding:80px 30px;text-align:center;"><p style="color:var(--muted);margin-bottom:20px;">Log in to see your PLAYR profile.</p><button class="btn btn-primary" onclick="openAuthModal('login')">Log In</button></div>`;
    return;
  }
  const p = PLAYR.currentProfile;
  const [{ data: followers }, { data: following }, posts] = await Promise.all([
    supa.from('follows').select('follower_id', { count: 'exact' }).eq('following_id', p.id),
    supa.from('follows').select('following_id', { count: 'exact' }).eq('follower_id', p.id),
    supa.from('posts').select('*').eq('user_id', p.id).order('created_at', { ascending: false })
  ]);
  wrap.innerHTML = `
    <div class="profile-cover" style="background-image:url('https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&h=500&fit=crop');"></div>
    <div class="profile-head">
      <div class="profile-avatar" style="background-image:url('${p.avatar_url || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=300&fit=crop'}');"></div>
      <div>
        <div class="profile-name">${p.display_name || p.username}</div>
        <div class="profile-sub">${(p.location || 'PLAYR MEMBER').toUpperCase()}${p.bio ? ' · ' + p.bio : ''}</div>
      </div>
      <button class="btn btn-ghost btn-sm" style="margin-left:auto;" onclick="openEditProfileModal()">Edit Profile</button>
    </div>
    <div class="profile-stats">
      <div class="pstat"><b>${(followers || []).length}</b><span>Followers</span></div>
      <div class="pstat"><b>${(following || []).length}</b><span>Following</span></div>
      <div class="pstat"><b>${posts.data?.length || 0}</b><span>Posts</span></div>
      <div class="pstat"><b>${userSportIds.size}</b><span>Sports Followed</span></div>
    </div>
    <div class="gallery" style="margin:20px 30px 10px;">
      ${(posts.data || []).filter(x => x.media_url).slice(0, 12).map(x => `<div style="background-image:url('${x.media_url}')"></div>`).join('') || `<p style="color:var(--muted);grid-column:1/-1;">No photo posts yet — <a style="color:var(--lime);cursor:pointer;" onclick="openCreatePostModal()">create one</a>.</p>`}
    </div>`;
}
function openEditProfileModal() {
  const p = PLAYR.currentProfile;
  openModal('Edit Profile', `
    ${fieldHTML('Display name', 'editDisplayName')}
    ${fieldHTML('Bio', 'editBio')}
    ${fieldHTML('Location', 'editLocation')}
    <div class="form-field"><label class="form-label">Profile photo</label><input class="form-input" id="editAvatar" type="file" accept="image/*"></div>
    <button class="btn btn-primary" style="width:100%;margin-top:6px;" onclick="submitEditProfile()">Save</button>`);
  document.getElementById('editDisplayName').value = p.display_name || '';
  document.getElementById('editBio').value = p.bio || '';
  document.getElementById('editLocation').value = p.location || '';
}
async function submitEditProfile() {
  try {
    const display_name = document.getElementById('editDisplayName').value.trim();
    const bio = document.getElementById('editBio').value.trim();
    const location = document.getElementById('editLocation').value.trim();
    const file = document.getElementById('editAvatar').files[0];
    await Profiles.updateOwn({ display_name, bio, location });
    if (file) await Profiles.uploadAvatar(file);
    PLAYR.currentProfile = await Profiles.get(PLAYR.currentUser.id);
    closeModal(); showToast('Profile updated'); refreshAuthUI(); renderProfile();
  } catch (err) { showToast(err.message || 'Could not update profile'); }
}

/* ============================================================
   Nav / view switching (unchanged behaviour from original)
   ============================================================ */
function switchView(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
  document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  toggleMobileMenu(false);
  closeDropdowns();
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  if (view === 'profile') renderProfile();
  if (view === 'communities') { renderCommunities(); renderActivity(); }
  if (view === 'events') { document.getElementById('eventsListWrap').style.display = 'block'; document.getElementById('eventDetailWrap').style.display = 'none'; renderEvents(); }
  if (view === 'challenges') { renderChallengeGrid(); renderLeaderboard(); }
  if (view === 'shop') { renderShopFilters().then(() => { renderShop(); renderMerch(); }); }
}
function toggleMobileMenu(open) { document.getElementById('mobileMenu').classList.toggle('open', open); }
function toggleDropdown(name) {
  const el = document.getElementById('dd-' + name);
  const isOpen = el.classList.contains('open');
  closeDropdowns();
  if (!isOpen) { el.classList.add('open'); if (name === 'notif') refreshNotifDropdown(); }
}
function closeDropdowns() { document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open')); }
document.addEventListener('click', (e) => { if (!e.target.closest('.nav-right')) closeDropdowns(); });

let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------- Profile tab toggle (athlete = real user; creator = illustrative example, kept static) ---------- */
function setProfileTab(tab) {
  document.querySelectorAll('[data-ptab]').forEach(b => b.classList.toggle('active', b.dataset.ptab === tab));
  document.getElementById('profile-athlete').style.display = tab === 'athlete' ? 'block' : 'none';
  document.getElementById('profile-creator').style.display = tab === 'creator' ? 'block' : 'none';
}

/* ---------- Event detail hub (fixtures/results/teams/etc. are illustrative — not part of the requested schema) ---------- */
function showEventDetail() {
  document.getElementById('eventsListWrap').style.display = 'none';
  document.getElementById('eventDetailWrap').style.display = 'block';
  setEventTab('fixtures');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function showEventsList() {
  document.getElementById('eventsListWrap').style.display = 'block';
  document.getElementById('eventDetailWrap').style.display = 'none';
}
function setEventTab(tab) {
  document.querySelectorAll('#eventTabs .su-tab').forEach(t => t.classList.toggle('active', t.dataset.etab === tab));
  const wrap = document.getElementById('eventPanels');
  wrap.innerHTML = `<p style="color:var(--muted);">This event hub view (fixtures/results/teams/highlights/merch) is illustrative in this MVP — wire it to the <b>events</b> table plus any future fixtures schema you add.</p>`;
}

/* ---------- decorative marketing bits kept static (no user data) ---------- */
const IMG_TICKER = [
  { sport: 'CRICKET', text: 'IND 287/4 — 42 overs' },
  { sport: 'FOOTBALL', text: 'Mumbai City FC 2 - 1 Bengaluru FC' },
  { sport: 'RUNNING', text: 'Community PB logged — 22:14' },
  { sport: 'MOTORSPORT', text: 'Verstappen sets fastest lap — Q3' },
];
function buildTicker() {
  const html = IMG_TICKER.concat(IMG_TICKER).map(t => `<div class="ticker-item"><span class="dot-live"></span><span class="tsport">${t.sport}</span><b>${t.text}</b></div>`).join('');
  document.getElementById('heroTicker').innerHTML = html;
}
async function buildPhoneFeed() {
  const { data } = await supa.from('posts').select('*, profiles:user_id(display_name,avatar_url), sports:sport_id(name)').order('created_at', { ascending: false }).limit(5);
  const posts = data && data.length ? data : [];
  document.getElementById('phoneFeed').innerHTML = posts.map(p => `
    <div class="feed-post-mini">
      <div class="fp-head">
        <div class="fp-avatar" style="background:url('${p.profiles?.avatar_url || ''}') center/cover;"></div>
        <div><div class="fp-name">${p.profiles?.display_name || 'PLAYR'}</div><div class="fp-meta">${(p.sports?.name || '').toUpperCase()} · ${timeAgo(p.created_at)}</div></div>
      </div>
      ${p.media_url ? `<div class="fp-media" style="background-image:url('${p.media_url}')"></div>` : ''}
    </div>`).join('') || `<div style="padding:30px;color:var(--muted);font-size:13px;">Be the first to post on PLAYR.</div>`;
}

/* ============================================================
   INIT
   ============================================================ */
async function initAuthState() {
  const session = await Auth.getSession();
  PLAYR.currentUser = session?.user || null;
  PLAYR.currentProfile = PLAYR.currentUser ? await Profiles.get(PLAYR.currentUser.id) : null;
}
async function init() {
  await initAuthState();
  refreshAuthUI();
  await loadSports();
  renderFilters();
  renderSports();
  renderHomeFeed();
  renderSuSwitch();
  renderSuTabs();
  if (sportsCache[0]) setSportUniverse(sportsCache[0].id);
  buildTicker();
  buildPhoneFeed();
  updateCartBadge();
  refreshNotifDropdown();
  setupNotificationRealtime();

  Auth.onChange(async (event) => {
    if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
      await initAuthState();
      refreshAuthUI();
      await loadSports();
      renderSports();
      renderHomeFeed();
      updateCartBadge();
      refreshNotifDropdown();
      setupNotificationRealtime();
      if (document.getElementById('view-profile').classList.contains('active')) renderProfile();
    }
  });
}
init();
