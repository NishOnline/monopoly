/**
 * Richup.io 1-1 Clone Game Client Engine
 * Complete client-side state manager, animations, board renderer & WebSockets controller
 */

// Crisp Circular SVG Flag & Symbol Badges (Matching Richup.io exact tile design)
const CIRCULAR_FLAGS = {
  BR: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#009c3b"/><polygon points="16,4 28,16 16,28 4,16" fill="#ffdf00"/><circle cx="16" cy="16" r="7" fill="#002776"/><path d="M10,17 C12,14 20,14 22,18" stroke="#ffffff" stroke-width="1.4" fill="none"/></svg>`,
  IL: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#ffffff"/><rect x="0" y="4" width="32" height="4.5" fill="#0038b8"/><rect x="0" y="23.5" width="32" height="4.5" fill="#0038b8"/><polygon points="16,10.5 20.5,18.5 11.5,18.5" fill="none" stroke="#0038b8" stroke-width="1.3"/><polygon points="16,21 20.5,13 11.5,13" fill="none" stroke="#0038b8" stroke-width="1.3"/></svg>`,
  IT: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#ffffff"/><path d="M0,0 H10.67 V32 H0 Z" fill="#009246"/><path d="M21.33,0 H32 V32 H21.33 Z" fill="#ce2b37"/></svg>`,
  DE: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#ffce00"/><path d="M0,0 H32 V10.67 H0 Z" fill="#000000"/><path d="M0,10.67 H32 V21.33 H0 Z" fill="#dd0000"/></svg>`,
  CN: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#de2910"/><polygon points="8,7 9.2,10.7 13.1,10.7 10,13 11.2,16.7 8,14.4 4.8,16.7 6,13 2.9,10.7 6.8,10.7" fill="#ffde00"/><circle cx="17" cy="6" r="1.2" fill="#ffde00"/><circle cx="20" cy="9" r="1.2" fill="#ffde00"/><circle cx="20" cy="14" r="1.2" fill="#ffde00"/><circle cx="17" cy="17" r="1.2" fill="#ffde00"/></svg>`,
  FR: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#ffffff"/><path d="M0,0 H10.67 V32 H0 Z" fill="#002654"/><path d="M21.33,0 H32 V32 H21.33 Z" fill="#ce1126"/></svg>`,
  GB: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#012169"/><path d="M0,0 L32,32 M32,0 L0,32" stroke="#ffffff" stroke-width="5.5"/><path d="M0,0 L32,32 M32,0 L0,32" stroke="#c8102e" stroke-width="2.5"/><path d="M16,0 V32 M0,16 H32" stroke="#ffffff" stroke-width="9"/><path d="M16,0 V32 M0,16 H32" stroke="#c8102e" stroke-width="5.5"/></svg>`,
  US: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#ffffff"/><path d="M0,4 H32 M0,9 H32 M0,14 H32 M0,19 H32 M0,24 H32 M0,29 H32" stroke="#b22234" stroke-width="2.5"/><rect x="0" y="0" width="16" height="16" fill="#3c3b6e"/><circle cx="4" cy="4" r="1.2" fill="#fff"/><circle cx="11" cy="4" r="1.2" fill="#fff"/><circle cx="7.5" cy="8" r="1.2" fill="#fff"/><circle cx="4" cy="12" r="1.2" fill="#fff"/><circle cx="11" cy="12" r="1.2" fill="#fff"/></svg>`,
  IN: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#ffffff"/><path d="M0,0 H32 V10.67 H0 Z" fill="#ff9933"/><path d="M0,21.33 H32 V32 H0 Z" fill="#138808"/><circle cx="16" cy="16" r="4" fill="none" stroke="#000080" stroke-width="1"/><circle cx="16" cy="16" r="1.2" fill="#000080"/></svg>`,
  JP: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#ffffff"/><circle cx="16" cy="16" r="7.5" fill="#bc002d"/></svg>`,
  GAS: `<svg viewBox="0 0 32 32" class="flag-circle-svg gas-icon-svg"><circle cx="16" cy="16" r="16" fill="#ea580c"/><path d="M16,5 C16,5 23,13 23,19 C23,24 19.5,27 16,27 C12.5,27 9,24 9,19 C9,13 16,5 16,5 Z" fill="#fde047"/><path d="M16,13 C16,13 20,18 20,21 C20,23.5 18,25.5 16,25.5 C14,25.5 12,23.5 12,21 C12,18 16,13 16,13 Z" fill="#f97316"/></svg>`,
  AIRPORT: `<svg viewBox="0 0 32 32" class="flag-circle-svg airport-icon-svg"><circle cx="16" cy="16" r="16" fill="#1e293b"/><path d="M16,5 L19,13 L28,17 L28,19.5 L19,17.5 L19,23.5 L21.5,25.5 L21.5,27.5 L16,26 L10.5,27.5 L10.5,25.5 L13,23.5 L13,17.5 L4,19.5 L4,17 L13,13 Z" fill="#94a3b8"/></svg>`,
  WATER: `<svg viewBox="0 0 32 32" class="flag-circle-svg water-icon-svg"><circle cx="16" cy="16" r="16" fill="#0891b2"/><path d="M11,11 H19 V15 H15 V20 H11 Z" fill="#ffffff"/><rect x="8" y="9" width="14" height="4" rx="2" fill="#e0f2fe"/><circle cx="17" cy="24" r="2.5" fill="#ffffff"/></svg>`,
  POWER: `<svg viewBox="0 0 32 32" class="flag-circle-svg power-icon-svg"><circle cx="16" cy="16" r="16" fill="#1e1b4b"/><polygon points="17,3 8,16 15,16 13,29 23,14 17,14" fill="#facc15" filter="drop-shadow(0 0 4px #facc15)"/></svg>`,
  CHEST: `<svg viewBox="0 0 36 36" class="flag-circle-svg treasure-chest-svg"><rect x="4" y="11" width="28" height="21" rx="3" fill="#e65100"/><rect x="2" y="8" width="32" height="6" rx="2" fill="#ff9800"/><rect x="15" y="8" width="6" height="24" fill="#ffd54f"/><path d="M14,8 C10,3 5,4 8,8 Z" fill="#ffd54f"/><path d="M22,8 C26,3 31,4 28,8 Z" fill="#ffd54f"/><circle cx="18" cy="8" r="2.5" fill="#ffca28"/></svg>`,
  CHANCE: `<svg viewBox="0 0 36 36" class="flag-circle-svg surprise-icon-svg"><text x="18" y="28" font-family="'Outfit', sans-serif" font-size="29" font-weight="900" text-anchor="middle" fill="#dc2626" filter="drop-shadow(0 1px 3px rgba(220,38,38,0.4))">?</text></svg>`,
  TAX: `<svg viewBox="0 0 32 32" class="flag-circle-svg tax-icon-svg"><rect x="6" y="5" width="20" height="22" rx="3" fill="#1e293b" stroke="#475569" stroke-width="1.5"/><text x="16" y="15" font-family="'Outfit', sans-serif" font-size="9" font-weight="800" text-anchor="middle" fill="#94a3b8">$</text><text x="16" y="23" font-family="'Outfit', sans-serif" font-size="8" font-weight="800" text-anchor="middle" fill="#38bdf8">%10</text></svg>`,
  PREMIUM_TAX: `<svg viewBox="0 0 32 32" class="flag-circle-svg tax-icon-svg"><polygon points="16,3 28,11 16,29 4,11" fill="#38bdf8" stroke="#0284c7" stroke-width="1.2"/><polygon points="16,3 23,11 16,29 9,11" fill="#7dd3fc"/><polygon points="9,11 16,3 23,11" fill="#bae6fd"/></svg>`
};

function getCircularFlagSvg(code) {
  return CIRCULAR_FLAGS[code] || `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#3b82f6"/><text x="16" y="21" font-size="14" text-anchor="middle" fill="#fff">🌐</text></svg>`;
}

function darkenColor(hex, factor = 0.35) {
  if (!hex || typeof hex !== 'string') return '#111827';
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  if (isNaN(num)) return '#111827';
  const r = Math.max(0, Math.floor(((num >> 16) & 255) * (1 - factor)));
  const g = Math.max(0, Math.floor(((num >> 8) & 255) * (1 - factor)));
  const b = Math.max(0, Math.floor((num & 255) * (1 - factor)));
  return `rgb(${r}, ${g}, ${b})`;
}

function getCartoonJailSvg() {
  return `<svg viewBox="0 0 64 64" class="cartoon-jail-svg">
    <rect x="6" y="4" width="52" height="56" rx="4" fill="#0f172a" stroke="#475569" stroke-width="2.5"/>
    <line x1="16" y1="4" x2="16" y2="60" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round"/>
    <line x1="27" y1="4" x2="27" y2="60" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round"/>
    <line x1="37" y1="4" x2="37" y2="60" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round"/>
    <line x1="48" y1="4" x2="48" y2="60" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round"/>
    <line x1="6" y1="20" x2="58" y2="20" stroke="#64748b" stroke-width="3"/>
    <line x1="6" y1="46" x2="58" y2="46" stroke="#64748b" stroke-width="3"/>
    <rect x="26" y="31" width="12" height="10" rx="2" fill="#f59e0b" stroke="#b45309" stroke-width="1.2"/>
    <path d="M29,31 V27 C29,25 35,25 35,27 V31" fill="none" stroke="#e2e8f0" stroke-width="2"/>
    <circle cx="32" cy="36" r="1.2" fill="#78350f"/>
  </svg>`;
}

function getCartoonSkullSvg() {
  return `<svg viewBox="0 0 64 64" class="cartoon-skull-svg">
    <path d="M15,15 L49,49 M49,15 L15,49" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
    <circle cx="13" cy="13" r="3" fill="#ffffff"/><circle cx="17" cy="11" r="3" fill="#ffffff"/>
    <circle cx="47" cy="11" r="3" fill="#ffffff"/><circle cx="51" cy="13" r="3" fill="#ffffff"/>
    <circle cx="13" cy="51" r="3" fill="#ffffff"/><circle cx="17" cy="53" r="3" fill="#ffffff"/>
    <circle cx="47" cy="53" r="3" fill="#ffffff"/><circle cx="51" cy="51" r="3" fill="#ffffff"/>
    <path d="M21,32 C21,18 43,18 43,32 C43,37 39,40 39,44 L25,44 C25,40 21,37 21,32 Z" fill="#ffffff"/>
    <ellipse cx="27" cy="30" rx="3.5" ry="4" fill="#0f172a"/>
    <ellipse cx="37" cy="30" rx="3.5" ry="4" fill="#0f172a"/>
    <polygon points="32,34 30.5,37 33.5,37" fill="#0f172a"/>
    <line x1="29" y1="44" x2="29" y2="41" stroke="#0f172a" stroke-width="1.5"/>
    <line x1="32" y1="44" x2="32" y2="41" stroke="#0f172a" stroke-width="1.5"/>
    <line x1="35" y1="44" x2="35" y2="41" stroke="#0f172a" stroke-width="1.5"/>
  </svg>`;
}

function getVacationSvg() {
  return `<svg viewBox="0 0 64 64" class="cartoon-vacation-svg">
    <ellipse cx="32" cy="48" rx="20" ry="7" fill="#facc15"/>
    <path d="M6,52 Q18,48 30,52 T54,52" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M12,56 Q24,53 36,56 T60,56" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round"/>
    <path d="M30,48 C28,36 32,24 35,16" fill="none" stroke="#b45309" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M35,16 Q20,10 12,20" fill="none" stroke="#22c55e" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M35,16 Q26,4 32,2" fill="none" stroke="#16a34a" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M35,16 Q45,6 52,14" fill="none" stroke="#22c55e" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M35,16 Q48,20 46,30" fill="none" stroke="#15803d" stroke-width="4" stroke-linecap="round"/>
    <circle cx="33" cy="18" r="2.5" fill="#78350f"/>
    <circle cx="37" cy="19" r="2.5" fill="#78350f"/>
  </svg>`;
}

class RichupGame {
  constructor() {
    this.ws = null;
    this.roomId = null;
    this.playerId = localStorage.getItem('richup_player_id') || ('user_' + Math.random().toString(36).substring(2, 9));
    localStorage.setItem('richup_player_id', this.playerId);
    this.isHost = false;
    this.isSpectator = false;
    this.gameState = null;
    this.boardData = null;

    // Local profile state
    this.playerName = localStorage.getItem('richup_player_name') || 'Player';
    this.selectedAvatar = '🚗';
    this.selectedColor = '#ef4444';
    this.selectedBotDifficulty = 'balanced';

    // Animation tracking
    this.previousPositions = {};
    this.previousCash = {};
    this.isRolling = false;
    this.soundMuted = false;

    // Anti-spam tracking
    this.lastReactionTime = 0;
    this.reactionBurstHistory = [];
    this.lastChatTime = 0;
    this.lastChatText = '';
    this.chatBurstHistory = [];

    // Modals
    this.activeTradePartnerId = null;
    this.negotiatingTradeId = null;
    this.heldIncomingTradeIds = new Set();
    this.heldAuctionTileId = null;
    this.currentIncomingTradeId = null;
    this.tradeOfferProperties = new Set();
    this.tradeRequestProperties = new Set();
  }

  async init() {
    const topNav = document.querySelector('.top-nav');
    if (topNav) topNav.style.display = 'none';
    this.initDOM();
    this.loadProfileFromStorage();
    await this.fetchBoardData();
    this.renderBoardSkeleton();
    this.setDiceFaces(1, 1);
    this.checkUrlForRoom();
    this.fetchOpenRooms();
    this.startHeartbeat();
    this.startClientTimer();
  }

  initDOM() {
    // Sound engine toggle
    const soundBtn = document.getElementById('btn-sound-toggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        this.soundMuted = !window.soundEngine.toggle();
        soundBtn.innerHTML = this.soundMuted ? '🔇' : '🔊';
        const mainSoundBtn = document.getElementById('btn-sound-main');
        if (mainSoundBtn) mainSoundBtn.innerHTML = this.soundMuted ? '🔇' : '🔊';
        this.showToast(this.soundMuted ? 'Sound muted' : 'Sound enabled');
      });
    }

    // Rules modal
    const rulesBtn = document.getElementById('btn-rules');
    if (rulesBtn) {
      rulesBtn.addEventListener('click', () => this.openModal('modal-rules'));
    }

    // Fullscreen toggle
    const fsBtn = document.getElementById('btn-fullscreen');
    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => { });
        } else {
          document.exitFullscreen().catch(() => { });
        }
      });
    }

    // Copy room link
    const copyBtn = document.getElementById('btn-copy-room');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const url = `${window.location.origin}/?room=${this.roomId}`;
        navigator.clipboard.writeText(url).then(() => {
          this.showToast('Room link copied to clipboard! 📋');
        });
      });
    }

    // Lobby tabs (Create / Join / Public Rooms)
    document.querySelectorAll('.lobby-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.lobby-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const targetId = tab.getAttribute('data-target');
        const target = document.getElementById(targetId);
        if (target) target.classList.add('active');
        if (targetId === 'tab-public') {
          this.fetchPublicRooms();
        }
      });
    });

    // Avatar pickers
    document.querySelectorAll('.avatar-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        if (opt.classList.contains('avatar-add-btn')) return;
        this.selectAvatar(opt.getAttribute('data-avatar'));
      });
    });

    // Custom avatar + button and modal event listeners
    document.querySelectorAll('.btn-add-custom-avatar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openCustomAvatarModal();
      });
    });

    const customAvatarInput = document.getElementById('input-custom-avatar');
    if (customAvatarInput) {
      customAvatarInput.addEventListener('input', () => {
        const char = this.extractFirstGrapheme(customAvatarInput.value);
        this.updateCustomAvatarPreview(char);
      });
      customAvatarInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.applyCustomAvatar();
        }
      });
    }

    document.querySelectorAll('.quick-pick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-val');
        if (customAvatarInput) customAvatarInput.value = val;
        this.updateCustomAvatarPreview(val);
      });
    });

    const saveCustomAvatarBtn = document.getElementById('btn-save-custom-avatar');
    if (saveCustomAvatarBtn) {
      saveCustomAvatarBtn.addEventListener('click', () => {
        this.applyCustomAvatar();
      });
    }

    // Color pickers
    document.querySelectorAll('.color-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        if (opt.classList.contains('taken')) {
          this.showActionReasonPopup('Color Already Taken', 'Another player is already using this color in this room. Please select a different color.');
          return;
        }
        this.selectColor(opt.getAttribute('data-color'));
      });
    });

    // Privacy toggle buttons on Create Room pane
    const privacyBtns = document.querySelectorAll('#privacy-toggle-create .privacy-btn');
    privacyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        privacyBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const val = btn.getAttribute('data-value') || btn.getAttribute('data-val');
        const hiddenInput = document.getElementById('input-room-public');
        if (hiddenInput) hiddenInput.value = val;
      });
    });

    // Create Room Button
    const createBtn = document.getElementById('btn-create-room');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        const nameInput = document.getElementById('input-player-name');
        if (nameInput) this.playerName = nameInput.value.trim() || 'Player';
        localStorage.setItem('richup_player_name', this.playerName);
        const isPublic = document.getElementById('input-room-public')?.value === 'true';
        this.showActionLoader();
        this.connectAndSend({
          action: 'CREATE_ROOM',
          playerId: this.playerId,
          playerName: this.playerName,
          avatar: this.selectedAvatar,
          color: this.selectedColor,
          is_public: isPublic,
          bot_difficulty: this.selectedBotDifficulty || 'balanced'
        });
      });
    }

    // Join Room Button
    const joinBtn = document.getElementById('btn-join-room');
    if (joinBtn) {
      joinBtn.addEventListener('click', () => {
        const nameInput = document.getElementById('input-join-name');
        const codeInput = document.getElementById('input-room-code');
        if (nameInput) this.playerName = nameInput.value.trim() || 'Player';
        const code = codeInput ? codeInput.value.trim().toUpperCase() : '';
        if (!code) {
          this.showToast('Please enter a room code');
          return;
        }
        localStorage.setItem('richup_player_name', this.playerName);

        // Retrieve saved player ID for this specific room if reconnecting
        const savedRoomPid = localStorage.getItem(`richup_player_id_${code}`) || localStorage.getItem('richup_player_id');
        if (savedRoomPid) {
          this.playerId = savedRoomPid;
        }

        this.connectAndSend({
          action: 'JOIN_ROOM',
          roomId: code,
          playerId: this.playerId,
          playerName: this.playerName,
          avatar: this.selectedAvatar,
          color: this.selectedColor
        });
      });
    }

    // Add Bot Button
    const addBotBtn = document.getElementById('btn-add-bot');
    if (addBotBtn) {
      addBotBtn.addEventListener('click', () => {
        this.sendAction({ action: 'ADD_BOT' });
      });
    }

    // Start Game Button
    const startBtn = document.getElementById('btn-start-game');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (this.gameState && this.gameState.players && this.gameState.players.length >= 2) {
          this.showActionLoader();
        }
        this.sendAction({ action: 'START_GAME' });
      });
    }

    // Host Settings Changes (Toggleable room rules)
    // 1. Starting Cash Steppers & Range Slider (1000, 1500, 2000, 2500)
    const cashSlider = document.getElementById('setting-cash');
    const cashBadge = document.getElementById('badge-cash-val');
    const cashMinusBtn = document.getElementById('btn-cash-minus');
    const cashPlusBtn = document.getElementById('btn-cash-plus');

    const updateCashUi = (val) => {
      val = Math.max(1000, Math.min(2500, val));
      if (cashSlider) cashSlider.value = val;
      if (cashBadge) cashBadge.innerText = `$${val.toLocaleString()}`;
    };

    if (cashSlider) {
      cashSlider.addEventListener('input', (e) => {
        updateCashUi(parseInt(e.target.value, 10));
      });
      cashSlider.addEventListener('change', () => this.applySettings());
    }

    if (cashMinusBtn) {
      cashMinusBtn.addEventListener('click', () => {
        if (!this.isHost || !cashSlider) return;
        const cur = parseInt(cashSlider.value, 10) || 1500;
        updateCashUi(Math.max(1000, cur - 500));
        this.applySettings();
      });
    }

    if (cashPlusBtn) {
      cashPlusBtn.addEventListener('click', () => {
        if (!this.isHost || !cashSlider) return;
        const cur = parseInt(cashSlider.value, 10) || 1500;
        updateCashUi(Math.min(2500, cur + 500));
        this.applySettings();
      });
    }

    // 2. Turn Timer Slider & Ticks (Min 45s, Max 150s)
    const timerSlider = document.getElementById('setting-timer-slider');
    const timerHidden = document.getElementById('setting-timer');
    const timerTicks = document.querySelectorAll('.timer-ticks span');
    const timerMap = [45, 60, 90, 120, 150];

    const updateTimerUi = (idx) => {
      idx = Math.max(0, Math.min(4, idx));
      if (timerSlider) timerSlider.value = idx;
      if (timerHidden) timerHidden.value = timerMap[idx];
      timerTicks.forEach((sp, i) => sp.classList.toggle('active', i === idx));
    };

    if (timerSlider) {
      timerSlider.addEventListener('input', (e) => {
        updateTimerUi(parseInt(e.target.value, 10));
      });
      timerSlider.addEventListener('change', () => this.applySettings());
    }

    timerTicks.forEach((sp, i) => {
      sp.addEventListener('click', () => {
        if (!this.isHost) return;
        updateTimerUi(i);
        this.applySettings();
      });
    });

    // 3. Richup Pill Toggles (Auctions green when on, everything else gold when on)
    document.querySelectorAll('.richup-pill-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!this.isHost) return;
        const settingKey = btn.getAttribute('data-setting');
        const hiddenInput = document.getElementById(settingKey);
        const isCurrentlyOn = btn.classList.contains('on');
        const newState = !isCurrentlyOn;
        const color = btn.getAttribute('data-color') || (btn.id === 'toggle-auction' ? 'green' : 'gold');

        btn.classList.toggle('on', newState);
        btn.classList.toggle('off', !newState);
        btn.classList.remove('green', 'gold', 'red');
        if (newState) {
          btn.classList.add(color);
        } else {
          btn.classList.add('red');
        }
        const textSpan = btn.querySelector('.toggle-text');
        if (textSpan) textSpan.innerText = newState ? 'ON' : 'OFF';
        if (hiddenInput) hiddenInput.value = String(newState);

        this.applySettings();
      });
    });

    // 4. Privacy Segmented Pill
    const segButtons = document.querySelectorAll('#segmented-privacy .seg-opt');
    segButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (!this.isHost) {
          if (this.roomId) this.showToast('Only the room host can change room visibility 🔒');
          return;
        }
        segButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const hiddenPrivacy = document.getElementById('setting-privacy');
        if (hiddenPrivacy) hiddenPrivacy.value = btn.getAttribute('data-val');
        this.applySettings();
      });
    });

    // 4b. Map Segmented Pill (Standard / Extended)
    const segMapButtons = document.querySelectorAll('#segmented-map .seg-opt');
    segMapButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (!this.isHost) {
          if (this.roomId) this.showToast('Only the room host can change map settings 🔒');
          return;
        }
        segMapButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const hiddenMap = document.getElementById('setting-map');
        if (hiddenMap) hiddenMap.value = btn.getAttribute('data-val');
        this.applySettings();
      });
    });

    // 4c. Bot Difficulty Segmented Pill in Room Settings (Conscious / Balanced / Determined)
    document.querySelectorAll('#segmented-bot-difficulty .seg-opt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const val = btn.getAttribute('data-val');
        this.setBotDifficulty(val);
      });
    });

    // 5. Back Buttons in Setup Menu & Logo Return to Main Menu
    const handleReturnToMain = () => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN && this.roomId) {
        this.sendAction({ action: 'LEAVE_ROOM' });
      }
      this.resetToMainMenu();
    };

    ['btn-back-setup', 'btn-back-top', 'richup-logo-home'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', handleReturnToMain);
      }
    });

    // 6. Floating Lobby Chat Drawer Toggle
    const toggleLobbyChatBtn = document.getElementById('btn-toggle-lobby-chat');
    const closeLobbyChatBtn = document.getElementById('btn-close-lobby-chat');
    const lobbyChatDrawer = document.getElementById('lobby-chat-drawer');
    if (toggleLobbyChatBtn && lobbyChatDrawer) {
      toggleLobbyChatBtn.addEventListener('click', () => {
        const isOpen = lobbyChatDrawer.style.display !== 'none';
        lobbyChatDrawer.style.display = isOpen ? 'none' : 'flex';
        if (!isOpen) {
          const pill = document.getElementById('lobby-chat-pill-count');
          if (pill) pill.style.display = 'none';
          const inp = document.getElementById('lobby-chat-input');
          if (inp) inp.focus();
        }
      });
    }
    if (closeLobbyChatBtn && lobbyChatDrawer) {
      closeLobbyChatBtn.addEventListener('click', () => {
        lobbyChatDrawer.style.display = 'none';
      });
    }

    // In-Game Central Action Buttons
    const rollBtn = document.getElementById('btn-action-roll');
    if (rollBtn) {
      rollBtn.addEventListener('click', () => {
        if (this.isRolling || this.isSpectator) return;
        this.sendAction({ action: 'ROLL_DICE' });
      });
    }

    const buyBtn = document.getElementById('btn-action-buy');
    if (buyBtn) {
      buyBtn.addEventListener('click', () => {
        this.sendAction({ action: 'BUY_PROPERTY' });
      });
    }

    const auctionActionBtn = document.getElementById('btn-action-auction');
    if (auctionActionBtn) {
      auctionActionBtn.addEventListener('click', () => {
        this.sendAction({ action: 'START_AUCTION' });
      });
    }

    const passPropBtn = document.getElementById('btn-action-pass-property');
    if (passPropBtn) {
      passPropBtn.addEventListener('click', () => {
        this.sendAction({ action: 'PASS_PROPERTY' });
      });
    }

    const endTurnBtn = document.getElementById('btn-action-end');
    if (endTurnBtn) {
      endTurnBtn.addEventListener('click', () => {
        if (this.animatingTokens && Object.keys(this.animatingTokens).length > 0) {
          this.showToast('⏳ Wait until movement finishes before ending turn.');
          return;
        }
        if (this.gameState && this.gameState.players) {
          const me = this.gameState.players.find(p => p.id === this.playerId);
          if (me && me.cash < 0) {
            this.showToast('⚠️ You have a negative balance! Mortgage or sell properties first.');
            return;
          }
        }
        this.sendAction({ action: 'END_TURN' });
      });
    }

    const payJailBtn = document.getElementById('btn-action-jail-fine');
    if (payJailBtn) {
      payJailBtn.addEventListener('click', () => {
        this.sendAction({ action: 'PAY_JAIL_FINE' });
      });
    }

    const useJailCardBtn = document.getElementById('btn-action-jail-card');
    if (useJailCardBtn) {
      useJailCardBtn.addEventListener('click', () => {
        this.sendAction({ action: 'USE_JAIL_CARD' });
      });
    }

    const resolveDebtBtn = document.getElementById('btn-action-debt');
    if (resolveDebtBtn) {
      resolveDebtBtn.addEventListener('click', () => {
        this.sendAction({ action: 'RESOLVE_DEBT' });
      });
    }

    const bankruptBtn = document.getElementById('btn-action-bankrupt');
    if (bankruptBtn) {
      bankruptBtn.addEventListener('click', () => {
        this.openModal('modal-confirm-bankruptcy');
      });
    }

    // Voluntary Bankruptcy in Sidebar
    const voluntaryBankruptBtn = document.getElementById('btn-voluntary-bankruptcy');
    if (voluntaryBankruptBtn) {
      voluntaryBankruptBtn.addEventListener('click', () => {
        if (!this.gameState || this.gameState.state !== 'PLAYING') return;
        const myP = this.gameState.players.find(p => p.id === this.playerId);
        if (!myP || myP.is_bankrupt || this.isSpectator) return;
        this.openModal('modal-confirm-bankruptcy');
      });
    }

    // Modal confirm bankruptcy action
    const confirmBankruptBtn = document.getElementById('btn-confirm-bankrupt-action');
    if (confirmBankruptBtn) {
      confirmBankruptBtn.addEventListener('click', () => {
        this.sendAction({ action: 'DECLARE_BANKRUPTCY' });
        this.closeAllModals();
      });
    }

    // Sidebar tab buttons
    document.querySelectorAll('.sidebar-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sidebar-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.getAttribute('data-tab');
        const playersView = document.getElementById('sidebar-players-view');
        const activityView = document.getElementById('sidebar-activity-view');
        const auctionsView = document.getElementById('sidebar-auctions-view');
        const tradesView = document.getElementById('sidebar-trades-view');
        const chatView = document.getElementById('sidebar-chat-view');

        if (playersView) playersView.style.display = tab === 'players' ? 'flex' : 'none';
        if (activityView) activityView.style.display = tab === 'activity' ? 'flex' : 'none';
        if (auctionsView) auctionsView.style.display = tab === 'auctions' ? 'flex' : 'none';
        if (tradesView) tradesView.style.display = tab === 'trades' ? 'flex' : 'none';
        if (chatView) chatView.style.display = tab === 'chat' ? 'flex' : 'none';

        if (tab === 'trades') this.renderTradesTab();
        if (tab === 'auctions') this.renderAuctionsTab();
        if (tab === 'chat') {
          this.activeSidebarTab = 'chat';
          const dot = document.getElementById('chat-unread-dot');
          if (dot) dot.style.display = 'none';
          this.renderChatMessages();
          const input = document.getElementById('chat-input');
          if (input) input.focus();
        } else {
          this.activeSidebarTab = tab;
        }
      });
    });

    // Cash range sliders for Trade Desk
    const myCashSlider = document.getElementById('trade-my-cash');
    const myCashDisplay = document.getElementById('trade-my-cash-display');
    if (myCashSlider && myCashDisplay) {
      myCashSlider.addEventListener('input', () => {
        myCashDisplay.innerText = `$${myCashSlider.value}`;
      });
    }

    const theirCashSlider = document.getElementById('trade-their-cash');
    const theirCashDisplay = document.getElementById('trade-their-cash-display');
    if (theirCashSlider && theirCashDisplay) {
      theirCashSlider.addEventListener('input', () => {
        theirCashDisplay.innerText = `$${theirCashSlider.value}`;
      });
    }

    // Close buttons for modals
    document.querySelectorAll('.modal-close, .btn-modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = btn.closest('.modal-backdrop');
        if (modal) {
          if (modal.id === 'modal-incoming-trade') {
            this.holdIncomingTrade();
            return;
          }
          if (modal.id === 'modal-auction') {
            this.holdAuction();
            return;
          }
        }
        this.closeAllModals();
      });
    });

    // Quick Reaction Buttons (Both active players and spectators) with Anti-Spam Throttling
    document.querySelectorAll('.reaction-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const emoji = btn.getAttribute('data-emoji');
        this.sendQuickReaction(emoji);
      });
    });

    // Notify server immediately on tab reload/close so offline grace timer starts at once
    const handleBeforeUnload = () => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN && this.roomId && this.playerId) {
        try {
          this.ws.send(JSON.stringify({
            action: 'CLIENT_DISCONNECT',
            roomId: this.roomId,
            playerId: this.playerId
          }));
          this.ws.close();
        } catch (e) { }
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    // Close every menu (financial profile, property inspector, rules, trade) on Escape key press
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        const activeModals = document.querySelectorAll('.modal-backdrop.active');
        activeModals.forEach(m => {
          if (m.id !== 'modal-gameover') {
            if (m.id === 'modal-incoming-trade') {
              this.holdIncomingTrade();
            } else if (m.id === 'modal-auction') {
              this.holdAuction();
            } else {
              m.classList.remove('active');
            }
          }
        });
      }
    });

    // Clicking modal backdrop also closes menus
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal && modal.id !== 'modal-gameover') {
          modal.classList.remove('active');
        }
      });
    });
  }

  loadProfileFromStorage() {
    const n1 = document.getElementById('input-player-name');
    const n2 = document.getElementById('input-join-name');
    if (n1) n1.value = this.playerName;
    if (n2) n2.value = this.playerName;

    const savedAvatar = localStorage.getItem('richup_player_avatar');
    if (savedAvatar) {
      this.selectedAvatar = savedAvatar;
      this.selectAvatar(savedAvatar);
    }

    const savedColor = localStorage.getItem('richup_player_color');
    if (savedColor) {
      this.selectedColor = savedColor;
      this.selectColor(savedColor);
    }
  }

  extractFirstGrapheme(str) {
    if (!str) return '';
    const trimmed = str.trim();
    if (!trimmed) return '';
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
      const iterator = segmenter.segment(trimmed)[Symbol.iterator]();
      const first = iterator.next();
      if (!first.done && first.value && first.value.segment) {
        return first.value.segment;
      }
    }
    return Array.from(trimmed)[0] || '';
  }

  updateCustomAvatarPreview(char) {
    const previewChar = document.getElementById('custom-avatar-preview-char');
    const previewToken = document.getElementById('custom-avatar-preview-token');
    if (previewChar) previewChar.innerText = char || '🚗';
    if (previewToken) {
      const col = this.selectedColor || '#ef4444';
      previewToken.style.backgroundColor = col;
      previewToken.style.borderColor = darkenColor(col, 0.35);
    }
  }

  openCustomAvatarModal() {
    const input = document.getElementById('input-custom-avatar');
    const currentAvatar = this.selectedAvatar || '🚗';
    if (input) {
      input.value = currentAvatar;
      setTimeout(() => input.focus(), 80);
    }
    this.updateCustomAvatarPreview(currentAvatar);
    this.openModal('modal-custom-avatar');
  }

  applyCustomAvatar() {
    const input = document.getElementById('input-custom-avatar');
    let char = this.extractFirstGrapheme(input ? input.value : '');
    if (!char) char = '🚗';
    this.selectAvatar(char);
    this.closeModal('modal-custom-avatar');
    this.showToast(`Token avatar set to ${char}! ✨`);
  }

  selectAvatar(avatarChar) {
    if (!avatarChar) return;
    this.selectedAvatar = avatarChar;
    localStorage.setItem('richup_player_avatar', avatarChar);

    document.querySelectorAll('.avatar-selector').forEach(selector => {
      let foundOpt = selector.querySelector(`.avatar-opt[data-avatar="${avatarChar}"]`);
      if (!foundOpt) {
        const addBtn = selector.querySelector('.avatar-add-btn');
        foundOpt = document.createElement('div');
        foundOpt.className = 'avatar-opt';
        foundOpt.setAttribute('data-avatar', avatarChar);
        foundOpt.innerText = avatarChar;
        foundOpt.title = `Custom: ${avatarChar}`;
        foundOpt.addEventListener('click', () => {
          this.selectAvatar(avatarChar);
        });
        if (addBtn) {
          selector.insertBefore(foundOpt, addBtn);
        } else {
          selector.appendChild(foundOpt);
        }
      }

      selector.querySelectorAll('.avatar-opt').forEach(o => o.classList.remove('selected'));
      foundOpt.classList.add('selected');
    });

    this.updateProfile();
  }

  selectColor(color) {
    if (!color) return;
    this.selectedColor = color;
    localStorage.setItem('richup_player_color', color);
    document.querySelectorAll('.color-opt').forEach(opt => {
      if (opt.getAttribute('data-color') === color) {
        opt.classList.add('selected');
      } else {
        opt.classList.remove('selected');
      }
    });
    this.updateProfile();
  }

  checkUrlForRoom() {
    const params = new URLSearchParams(window.location.search);
    const room = params.get('room');
    if (room) {
      const codeInput = document.getElementById('input-room-code');
      if (codeInput) codeInput.value = room.toUpperCase();
      const joinTab = document.querySelector('.lobby-tab[data-target="tab-join"]');
      if (joinTab) joinTab.click();

      // If reloaded or returning to this room, auto-reconnect!
      const lastRoom = localStorage.getItem('richup_last_room');
      if (lastRoom === room.toUpperCase()) {
        setTimeout(() => this.quickJoin(room.toUpperCase()), 100);
      }
    }
  }

  async fetchBoardData(preferredMap = null) {
    try {
      let mapName = preferredMap || (this.gameState && this.gameState.settings && this.gameState.settings.map) || 'classic';
      if (mapName === 'standard') mapName = 'classic';
      const res = await fetch('/api/board?map=' + encodeURIComponent(mapName) + '&t=' + Date.now(), { cache: 'no-store' });
      const data = await res.json();
      this.mapsData = data.maps || null;
      this.boardData = data;
    } catch (e) {
      console.error('Failed to load board data', e);
    }
  }

  async fetchPublicRooms() {
    await this.fetchOpenRooms();
  }

  copyRoomCode() {
    const code = this.roomId;
    if (!code) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).catch(() => { });
    }
    const toast = document.getElementById('copy-code-toast');
    if (toast) {
      toast.style.display = 'block';
      setTimeout(() => { toast.style.display = 'none'; }, 1500);
    }
  }

  async fetchOpenRooms() {
    try {
      const res = await fetch('/api/rooms?t=' + Date.now());
      const data = await res.json();
      const listEl = document.getElementById('public-rooms-list');
      if (!listEl) return;
      if (!data.rooms || data.rooms.length === 0) {
        listEl.innerHTML = '<div style="color:var(--text-muted);font-size:0.85rem;padding:20px;text-align:center;">No open public games right now.<br>Create a game and set Room Visibility to 🌐 Public!</div>';
        return;
      }
      listEl.innerHTML = data.rooms.map(r => {
        const isPlaying = r.state === 'PLAYING';
        return `
          <div class="public-room-card">
            <div class="public-room-info">
              <div class="public-room-code-line">
                <span class="public-room-code">${r.roomId}</span>
                <span class="public-room-badge ${isPlaying ? 'badge-playing' : 'badge-lobby'}">
                  ${isPlaying ? '👁️ LIVE' : 'Waiting in Lobby'}
                </span>
              </div>
              <div class="public-room-meta">
                Host: <strong>${r.hostName}</strong> • Players: <strong>${r.playersCount}/${r.maxPlayers}</strong>
              </div>
            </div>
            <button class="btn-join-public" onclick="game.quickJoin('${r.roomId}')">
              ${isPlaying ? '👁️ Spectate' : 'Join Game'}
            </button>
          </div>
        `;
      }).join('');
    } catch (e) {
      console.error('Failed to fetch rooms', e);
    }
  }

  quickJoin(code) {
    const c = (code || '').toUpperCase().trim();
    if (!c) return;
    const codeInput = document.getElementById('input-room-code');
    if (codeInput) codeInput.value = c;
    const nameInput = document.getElementById('input-join-name');
    if (nameInput) this.playerName = nameInput.value.trim() || this.playerName || 'Player';

    // Retrieve saved player ID for this specific room if reconnecting
    const savedRoomPid = localStorage.getItem(`richup_player_id_${c}`) || localStorage.getItem('richup_player_id');
    if (savedRoomPid) {
      this.playerId = savedRoomPid;
    }

    this.connectAndSend({
      action: 'JOIN_ROOM',
      roomId: c,
      playerId: this.playerId,
      playerName: this.playerName,
      avatar: this.selectedAvatar,
      color: this.selectedColor
    });
  }

  // ================= WebSocket Management =================
  connectAndSend(initialPayload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(initialPayload));
      return;
    }

    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Allows setting a custom backend URL (useful when frontend is hosted on Vercel and backend on Render/Railway)
    const customBackend = window.GAME_SERVER_URL || localStorage.getItem('GAME_SERVER_URL');
    const wsUrl = customBackend ? (customBackend.startsWith('ws') ? customBackend : `${proto}//${customBackend}/ws`) : `${proto}//${window.location.host}/ws`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify(initialPayload));
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        this.handleMessage(msg);
      } catch (e) {
        console.error('Failed to parse message', e);
      }
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      this.showToast('Connection error');
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed');
    };
  }

  sendAction(payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  startHeartbeat() {
    setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.sendAction({ action: 'PING' });
      }
    }, 10000);
  }

  startClientTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (!this.gameState || this.gameState.state !== 'PLAYING') return;

      const state = this.gameState;
      const timerBox = document.getElementById('center-timer-box');

      // 1. Turn timer: continuous countdown for the active turn until the player clicks End Turn (or expires)
      const currPlayer = state.players ? state.players.find(p => p.id === state.current_player_id) : null;
      const isCurrInDebt = currPlayer && currPlayer.cash < 0;

      if (state.turn_phase === 'WAITING_ROLL' || state.turn_phase === 'LANDED_ACTION' || state.turn_phase === 'WAITING_END_TURN' || state.turn_phase === 'DEBT') {
        let secs = 0;
        if (state.turn_deadline) {
          const now = Date.now() / 1000;
          secs = Math.max(0, Math.ceil(state.turn_deadline - now));
        } else if (typeof this.currentTurnTimeLeft === 'number') {
          this.currentTurnTimeLeft = Math.max(0, this.currentTurnTimeLeft - 0.25);
          secs = Math.ceil(this.currentTurnTimeLeft);
        }
        if (timerBox) {
          timerBox.innerText = `${secs}s`;
          timerBox.classList.toggle('urgent', secs <= 10 || isCurrInDebt);
          timerBox.title = isCurrInDebt ? 'Liquidate properties before debt timer expires!' : 'Turn time remaining (auto-ends if expired)';
        }
      } else {
        if (timerBox) {
          timerBox.innerText = '';
          timerBox.classList.remove('urgent');
        }
      }

      // 2. Auction timer: countdown timer with smooth display
      if (state.turn_phase === 'AUCTION' && state.auction) {
        const auc = state.auction;
        const aucTimer = document.getElementById('auction-timer-pill');
        const sbAucTimer = document.getElementById('sidebar-auction-timer-pill');
        if (auc.deadline) {
          const now = Date.now() / 1000;
          const diff = Math.max(0, (auc.deadline - now));
          const displaySecs = Math.ceil(diff);
          const txt = displaySecs > 0 ? `⏱️ Ending in <strong>${displaySecs}s</strong>` : `🔨 Concluding...`;
          if (aucTimer) {
            aucTimer.innerHTML = txt;
            aucTimer.classList.toggle('urgent', displaySecs <= 2 && displaySecs > 0);
          }
          if (sbAucTimer) {
            sbAucTimer.innerHTML = txt;
            sbAucTimer.style.color = displaySecs <= 2 ? '#ef4444' : '#fbbf24';
            sbAucTimer.style.fontWeight = 'bold';
          }
        } else {
          const defaultTxt = `⚖️ Place your bet (15s to place bid)`;
          if (aucTimer) {
            aucTimer.innerHTML = defaultTxt;
            aucTimer.classList.remove('urgent');
          }
          if (sbAucTimer) {
            sbAucTimer.innerHTML = defaultTxt;
            sbAucTimer.style.color = 'var(--text-muted)';
            sbAucTimer.style.fontWeight = 'normal';
          }
        }
      }

      // 3. Disconnect grace countdown timer (100s)
      const nowSecs = Date.now() / 1000;
      document.querySelectorAll('.disconnect-timer-badge').forEach(badge => {
        const deadline = parseFloat(badge.getAttribute('data-deadline'));
        if (deadline) {
          const secs = Math.max(0, Math.ceil(deadline - nowSecs));
          badge.innerHTML = `⚠️ Offline (${secs}s)`;
        }
      });
      document.querySelectorAll('.token-disconnect-badge').forEach(badge => {
        const deadline = parseFloat(badge.getAttribute('data-deadline'));
        if (deadline) {
          const secs = Math.max(0, Math.ceil(deadline - nowSecs));
          badge.innerHTML = `⚠️ ${secs}s`;
        }
      });
    }, 250);
  }

  handleMessage(msg) {
    switch (msg.type) {
      case 'JOINED_SUCCESS':
        this.roomId = msg.roomId;
        this.playerId = msg.playerId;
        this.isHost = Boolean(msg.isHost);
        this.isSpectator = Boolean(msg.isSpectator);
        localStorage.setItem('richup_player_id', this.playerId);
        localStorage.setItem(`richup_player_id_${this.roomId}`, this.playerId);
        localStorage.setItem(`richup_player_name_${this.roomId}`, this.playerName);
        localStorage.setItem('richup_last_room', this.roomId);
        if (window.history && window.history.replaceState) {
          window.history.replaceState({}, '', `/?room=${this.roomId}`);
        }

        document.getElementById('nav-room-badge').style.display = 'flex';
        document.getElementById('nav-room-code').innerText = this.roomId;

        if (this.isSpectator) {
          // Immediately switch to game screen in spectator mode!
          document.getElementById('screen-welcome').classList.remove('active');
          document.getElementById('game-screen').classList.add('active');
          const specPill = document.getElementById('nav-spectator-pill');
          if (specPill) {
            specPill.style.display = 'flex';
            specPill.innerHTML = '<span>👁️ Spectating Game</span>';
          }
          this.showToast('Joined live game as spectator! 👁️');
        } else {
          const specPill = document.getElementById('nav-spectator-pill');
          if (specPill) specPill.style.display = 'none';
          if (msg.roomState === 'PLAYING' || (this.gameState && this.gameState.state === 'PLAYING')) {
            this.hideActionLoader();
            document.getElementById('screen-welcome').classList.remove('active');
            document.getElementById('game-screen').classList.add('active');
            const topNav = document.querySelector('.top-nav');
            if (topNav) topNav.style.display = 'flex';
            this.renderBoardSkeleton();
            this.renderTileStates();
            this.renderPlayerTokens();
            this.renderCenterDeck();
          } else {
            this.showLobbyRoomView();
          }
        }
        break;

      case 'GAME_STATE':
        this.updateGameState(msg.data);
        break;

      case 'REACTION':
        this.displayReaction(msg);
        break;

      case 'ERROR':
        this.hideActionLoader();
        this.showToast(msg.message, 'error');
        break;

      case 'ACTION_ERROR':
        this.hideActionLoader();
        this.showActionReasonPopup(msg.title || 'Action Not Allowed', msg.message || 'This action is not possible.');
        break;

      case 'LEFT_ROOM':
        this.hideActionLoader();
        this.resetToMainMenu();
        break;
    }
  }

  showActionLoader() {
    const loader = document.getElementById('action-loader-overlay');
    if (loader) loader.style.display = 'flex';
    if (this._actionLoaderTimer) clearTimeout(this._actionLoaderTimer);
    this._actionLoaderTimer = setTimeout(() => {
      this.hideActionLoader();
    }, 10000);
  }

  hideActionLoader() {
    if (this._actionLoaderTimer) {
      clearTimeout(this._actionLoaderTimer);
      this._actionLoaderTimer = null;
    }
    const loader = document.getElementById('action-loader-overlay');
    if (loader) loader.style.display = 'none';
  }

  showLobbyRoomView() {
    this.hideActionLoader();
    const lobbyScreen = document.getElementById('lobby-screen');
    if (lobbyScreen) lobbyScreen.style.display = 'none';
    const welcomeBox = document.getElementById('lobby-welcome-box');
    if (welcomeBox) welcomeBox.style.display = 'none';
    const welcomeView = document.getElementById('lobby-welcome-view');
    if (welcomeView) welcomeView.style.display = 'none';
    const roomView = document.getElementById('room-lobby-view');
    if (roomView) {
      roomView.style.display = 'flex';
      roomView.style.flexDirection = 'column';
      roomView.style.alignItems = 'center';
      roomView.style.justifyContent = 'center';
      roomView.style.width = '100%';
    }

    const topNav = document.querySelector('.top-nav');
    if (topNav) topNav.style.display = 'none';

    const codeValEl = document.getElementById('setup-room-code-val');
    if (codeValEl) codeValEl.innerText = this.roomId || '----';
  }

  resetToMainMenu() {
    this.roomId = null;
    this.playerId = localStorage.getItem('richup_player_id') || this.playerId;
    this.isHost = false;
    this.isSpectator = false;
    this.gameState = null;
    document.getElementById('nav-room-badge').style.display = 'none';
    const specPill = document.getElementById('nav-spectator-pill');
    if (specPill) specPill.style.display = 'none';
    document.getElementById('screen-welcome').classList.add('active');
    document.getElementById('game-screen').classList.remove('active');
    const lobbyScreen = document.getElementById('lobby-screen');
    if (lobbyScreen) lobbyScreen.style.display = 'flex';
    const welcomeBox = document.getElementById('lobby-welcome-box');
    if (welcomeBox) welcomeBox.style.display = 'flex';
    const welcomeView = document.getElementById('lobby-welcome-view');
    if (welcomeView) welcomeView.style.display = 'block';
    const roomView = document.getElementById('room-lobby-view');
    if (roomView) roomView.style.display = 'none';
    const topNav = document.querySelector('.top-nav');
    if (topNav) topNav.style.display = 'none';
    this.fetchOpenRooms();
  }

  updateProfile() {
    this.sendAction({
      action: 'UPDATE_PROFILE',
      avatar: this.selectedAvatar,
      color: this.selectedColor
    });
  }

  syncPillToggle(btnId, inputId, isOn, colorClass) {
    const btn = document.getElementById(btnId);
    const hidden = document.getElementById(inputId);
    if (!btn) return;
    btn.classList.toggle('on', isOn);
    btn.classList.toggle('off', !isOn);
    btn.classList.remove('green', 'gold', 'red');
    if (isOn) {
      btn.classList.add(colorClass || 'gold');
    } else {
      btn.classList.add('red');
    }
    const textSpan = btn.querySelector('.toggle-text');
    if (textSpan) textSpan.innerText = isOn ? 'ON' : 'OFF';
    if (hidden) hidden.value = String(isOn);
  }

  syncPrivacySegmented(isPublic) {
    const hidden = document.getElementById('setting-privacy');
    if (hidden) hidden.value = String(isPublic);
    const btns = document.querySelectorAll('#segmented-privacy .seg-opt');
    btns.forEach(b => {
      const val = b.getAttribute('data-val') === 'true';
      b.classList.toggle('active', val === isPublic);
    });
  }

  syncMapSegmented(mapVal) {
    if (mapVal === 'standard') mapVal = 'classic';
    const hidden = document.getElementById('setting-map');
    if (hidden) hidden.value = mapVal;
    const btns = document.querySelectorAll('#segmented-map .seg-opt');
    btns.forEach(b => {
      let val = b.getAttribute('data-val');
      if (val === 'standard') val = 'classic';
      b.classList.toggle('active', val === mapVal);
    });
  }

  setBotDifficulty(diffVal) {
    const val = (diffVal || '').toLowerCase().trim();
    if (!['conscious', 'balanced', 'determined'].includes(val)) return;

    if (this.roomId && !this.isHost) {
      this.showToast('Only the room host can change bot difficulty 🔒');
      return;
    }

    this.selectedBotDifficulty = val;
    this.syncBotDifficultySegmented(val);

    if (this.isHost) {
      this.applySettings();
    }
  }

  syncBotDifficultySegmented(diffVal) {
    const val = (diffVal || this.selectedBotDifficulty || 'balanced').toLowerCase().trim();
    this.selectedBotDifficulty = val;

    const el = document.getElementById('setting-bot-difficulty');
    if (el) el.value = val;

    document.querySelectorAll('#segmented-bot-difficulty .seg-opt').forEach(b => {
      const bVal = (b.getAttribute('data-val') || '').toLowerCase().trim();
      b.classList.toggle('active', bVal === val);
    });
  }

  setGameMode(mode) {
    const val = (mode || 'individual').toLowerCase().trim();
    if (!['individual', 'alliances'].includes(val)) return;

    if (this.roomId && !this.isHost) {
      this.showToast('Only the room host can change game mode 🔒');
      return;
    }

    this.selectedGameMode = val;
    this.syncGameModeSegmented(val);

    if (this.isHost) {
      this.applySettings();
    }
  }

  syncGameModeSegmented(modeVal) {
    const val = (modeVal || this.selectedGameMode || 'individual').toLowerCase().trim();
    this.selectedGameMode = val;

    const el = document.getElementById('setting-game-mode');
    if (el) el.value = val;

    document.querySelectorAll('#segmented-game-mode .seg-opt').forEach(b => {
      const bVal = (b.getAttribute('data-val') || '').toLowerCase().trim();
      b.classList.toggle('active', bVal === val);
    });

    const container = document.querySelector('.richup-setup-container');
    const panel = document.getElementById('alliances-panel');
    const isAlliances = (val === 'alliances');
    if (container) container.classList.toggle('alliances-open', isAlliances);
    if (panel) panel.style.display = isAlliances ? 'flex' : 'none';
  }

  applySettings() {
    if (!this.isHost) return;
    const startingCash = parseInt(document.getElementById('setting-cash').value, 10);
    const turnTimer = parseInt(document.getElementById('setting-timer').value, 10);
    const parkingJackpot = document.getElementById('setting-parking') ? document.getElementById('setting-parking').value === 'true' : true;
    const auctionOnDecline = document.getElementById('setting-auction') ? document.getElementById('setting-auction').value === 'true' : true;
    const doubleRent = document.getElementById('setting-double-rent') ? document.getElementById('setting-double-rent').value === 'true' : true;
    const prisonRent = document.getElementById('setting-prison-rent') ? document.getElementById('setting-prison-rent').value === 'true' : true;
    const evenBuild = document.getElementById('setting-even-build') ? document.getElementById('setting-even-build').value === 'true' : false;
    const mortgage = document.getElementById('setting-mortgage') ? document.getElementById('setting-mortgage').value === 'true' : true;
    const advancedShops = document.getElementById('setting-advanced-shops') ? document.getElementById('setting-advanced-shops').value === 'true' : true;
    const randomEvents = document.getElementById('setting-random-events') ? document.getElementById('setting-random-events').value === 'true' : true;
    const mapEl = document.getElementById('setting-map');
    const mapVal = mapEl ? mapEl.value : 'standard';
    const privacyEl = document.getElementById('setting-privacy');
    const isPublic = privacyEl ? privacyEl.value === 'true' : false;
    const botDiffEl = document.getElementById('setting-bot-difficulty');
    const botDifficulty = this.selectedBotDifficulty || (botDiffEl ? botDiffEl.value : 'balanced');
    const gameModeEl = document.getElementById('setting-game-mode');
    const gameMode = this.selectedGameMode || (gameModeEl ? gameModeEl.value : 'individual');

    this.sendAction({
      action: 'UPDATE_SETTINGS',
      settings: {
        starting_cash: startingCash,
        turn_timer_seconds: turnTimer,
        free_parking_jackpot: parkingJackpot,
        auction_on_decline: auctionOnDecline,
        double_rent_full_set: doubleRent,
        no_rent_in_prison: prisonRent,
        even_build: evenBuild,
        mortgage_enabled: mortgage,
        advanced_shops: advancedShops,
        random_events: randomEvents,
        map: mapVal,
        is_public: isPublic,
        bot_difficulty: botDifficulty,
        game_mode: gameMode
      }
    });
  }

  // ================= Game State Renderer =================
  updateGameState(data) {
    const prevState = this.gameState;
    this.gameState = data;

    // Dynamically update host status if host changed (e.g. host migration)
    if (data.host_id) {
      this.isHost = (this.playerId === data.host_id);
    }

    // Reset spectator state whenever player is seated in the room's players list
    const myPlayerInList = data.players ? data.players.find(p => p.id === this.playerId) : null;
    if (myPlayerInList) {
      this.isSpectator = false;
      const specPill = document.getElementById('nav-spectator-pill');
      if (specPill) specPill.style.display = 'none';
    }

    if (data.state === 'LOBBY') {
      this.closeModal('modal-gameover');
      this.closeModal('modal-confirm-bankruptcy');
      document.getElementById('screen-welcome').classList.add('active');
      document.getElementById('game-screen').classList.remove('active');
      this.showLobbyRoomView();
    }

    // Sync settings across clients in lobby
    if (data.settings) {
      if (document.getElementById('setting-cash')) {
        const cashVal = Math.max(1000, Math.min(2500, data.settings.starting_cash || 1500));
        document.getElementById('setting-cash').value = cashVal;
        const badge = document.getElementById('badge-cash-val');
        if (badge) badge.innerText = `$${cashVal.toLocaleString()}`;
      }
      if (document.getElementById('setting-timer-slider')) {
        const sec = data.settings.turn_timer_seconds;
        const timerMap = [45, 60, 90, 120, 150];
        const idx = timerMap.indexOf(sec);
        const timerIdx = idx !== -1 ? idx : 0;
        document.getElementById('setting-timer-slider').value = timerIdx;
        const hiddenTimer = document.getElementById('setting-timer');
        if (hiddenTimer) hiddenTimer.value = sec;
        const timerTicks = document.querySelectorAll('.timer-ticks span');
        timerTicks.forEach((sp, i) => sp.classList.toggle('active', i === timerIdx));
      }
      this.syncPillToggle('toggle-auction', 'setting-auction', Boolean(data.settings.auction_on_decline), 'green');
      this.syncPillToggle('toggle-double-rent', 'setting-double-rent', data.settings.double_rent_full_set !== false, 'gold');
      this.syncPillToggle('toggle-prison-rent', 'setting-prison-rent', data.settings.no_rent_in_prison !== false, 'gold');
      this.syncPillToggle('toggle-mortgage', 'setting-mortgage', data.settings.mortgage_enabled !== false, 'gold');
      this.syncPillToggle('toggle-even-build', 'setting-even-build', data.settings.even_build === true, 'gold');
      this.syncPillToggle('toggle-advanced-shops', 'setting-advanced-shops', data.settings.advanced_shops !== false, 'gold');
      this.syncPillToggle('toggle-random-events', 'setting-random-events', data.settings.random_events !== false, 'gold');
      this.syncPrivacySegmented(Boolean(data.settings.is_public));
      if (data.settings.bot_difficulty) {
        this.syncBotDifficultySegmented(data.settings.bot_difficulty);
      } else {
        this.syncBotDifficultySegmented(this.selectedBotDifficulty || 'balanced');
      }
      this.syncGameModeSegmented(data.settings.game_mode || 'individual');

      let currentMap = data.settings.map || 'classic';
      if (currentMap === 'standard') currentMap = 'classic';
      this.syncMapSegmented(currentMap);
      if (this.mapsData && this.mapsData[currentMap] && (!this.boardData || this.boardData.map !== currentMap)) {
        this.boardData = { ...this.mapsData[currentMap], map: currentMap, maps: this.mapsData };
        this.renderBoardSkeleton();
        this.renderTileStates();
        this.renderPlayerTokens();
      }

      // Visual indication for non-host players (keep interactive so clicking gives clear feedback)
      const isHost = this.isHost;
      document.querySelectorAll('.setup-stepper-btn, .setup-golden-slider, .richup-pill-toggle, #segmented-privacy .seg-opt, #segmented-map .seg-opt, #segmented-bot-difficulty .seg-opt, #segmented-game-mode .seg-opt').forEach(el => {
        el.style.opacity = isHost ? '1' : '0.65';
      });
      const addBotBtn = document.getElementById('btn-add-bot');
      if (addBotBtn) {
        addBotBtn.style.display = isHost ? 'flex' : 'none';
      }
      const startBtn = document.getElementById('btn-start-game');
      if (startBtn) {
        startBtn.style.display = isHost ? 'block' : 'none';
      }
    }

    // Detect switch from LOBBY to PLAYING (or if spectator already on game screen)
    if (data.state === 'PLAYING') {
      this.hideActionLoader();
      this.closeModal('modal-gameover');
      document.getElementById('screen-welcome').classList.remove('active');
      document.getElementById('game-screen').classList.add('active');
      const topNav = document.querySelector('.top-nav');
      if (topNav) topNav.style.display = 'flex';
    } else if (data.state === 'GAME_OVER') {
      this.showGameOverModal();
    } else if (data.state === 'LOBBY') {
      this.renderLobbyPlayers();
      return;
    }

    // Check if local player is bankrupt or spectator
    const myPlayer = data.players.find(p => p.id === this.playerId);
    const specPill = document.getElementById('nav-spectator-pill');
    if (data.state === 'LOBBY') {
      if (specPill) specPill.style.display = 'none';
    } else if (this.isSpectator) {
      if (specPill) {
        specPill.style.display = 'flex';
        specPill.innerHTML = '<span>👁️ Spectating Game</span>';
      }
    } else if (myPlayer && myPlayer.is_bankrupt) {
      if (specPill) {
        specPill.style.display = 'flex';
        specPill.innerHTML = '<span>👁️ Spectating (Eliminated)</span>';
      }
    } else {
      if (specPill) specPill.style.display = 'none';
    }

    // Play sounds and animations on state changes (jackpot, monopolies, cash delta)
    try {
      this.handleSoundAndFX(prevState, data);
    } catch (e) {
      console.error('Error in handleSoundAndFX:', e);
    }

    // Render Board Tiles (owners, houses, mortgages)
    try {
      this.renderTileStates();
    } catch (e) {
      console.error('Error in renderTileStates:', e);
    }

    // Check if new dice roll occurred in this state update
    const diceChanged = data.last_dice && (!prevState || !prevState.last_dice || prevState.last_dice[0] !== data.last_dice[0] || prevState.last_dice[1] !== data.last_dice[1]);
    const rollPhaseTransition = prevState && prevState.turn_phase === 'WAITING_ROLL' && data.turn_phase !== 'WAITING_ROLL';
    const isNewDiceRoll = (diceChanged || rollPhaseTransition) && data.last_dice;

    if (isNewDiceRoll) {
      // First dice roll animation plays to completion, then player tokens move!
      const d1 = data.last_dice[0];
      const d2 = data.last_dice[1];
      this.triggerDiceAnimation(d1, d2, () => {
        try { this.renderPlayerTokens(); } catch (e) { console.error('Error in renderPlayerTokens:', e); }
        try { this.renderCenterDeck(); } catch (e) { console.error('Error in renderCenterDeck:', e); }
      });
    } else {
      // Normal state update: render tokens and center deck immediately
      try { this.renderPlayerTokens(); } catch (e) { console.error('Error in renderPlayerTokens:', e); }
      try { this.renderCenterDeck(); } catch (e) { console.error('Error in renderCenterDeck:', e); }
    }

    // Render Sidebar (Players and Activity Feed)
    try {
      this.renderSidebar();
    } catch (e) {
      console.error('Error in renderSidebar:', e);
    }

    // Render Active Auction if present
    try {
      this.renderAuction();
    } catch (e) {
      console.error('Error in renderAuction:', e);
    }

    // Check for incoming trades (only for active non-spectators)
    if (!this.isSpectator && myPlayer && !myPlayer.is_bankrupt) {
      try {
        this.checkIncomingTrades();
      } catch (e) {
        console.error('Error in checkIncomingTrades:', e);
      }
    }
  }

  handleSoundAndFX(prev, curr) {
    if (!prev) return;

    // 2. Check for newly completed monopoly sets (2-second highlight animation)
    if (curr.players && this.boardData && this.boardData.color_groups) {
      curr.players.forEach(p => {
        const prevP = prev.players ? prev.players.find(x => x.id === p.id) : null;
        const prevMonos = (prevP && prevP.monopolies) || [];
        const currMonos = p.monopolies || [];
        currMonos.forEach(gKey => {
          if (!prevMonos.includes(gKey)) {
            this.triggerMonopolySetHighlight(p, gKey);
          }
        });
      });
    }

    // 3. Activity feed logs tracking (Rent, Cards, Jackpots)
    if (!this._seenLogIds) {
      this._seenLogIds = new Set((curr.logs || []).map(l => l.id));
    }
    const newLogs = (curr.logs || []).filter(l => !this._seenLogIds.has(l.id));
    newLogs.forEach(l => this._seenLogIds.add(l.id));

    // Rent paid sound effect
    const rentLog = newLogs.find(l =>
      l.category === 'rent' ||
      (l.text && (l.text.includes('rent') || l.text.includes('owes $')))
    );
    if (rentLog && window.soundEngine && typeof window.soundEngine.rentPaid === 'function') {
      window.soundEngine.rentPaid();
    }

    // Vacation jackpot popup box
    const jackpotLog = newLogs.find(l =>
      l.category === 'vacation' ||
      l.category === 'jackpot' ||
      (l.text && (l.text.includes('Vacation jackpot') || l.text.includes('free parking')))
    );
    if (jackpotLog) {
      this.showCardPopup(jackpotLog.text, 'vacation');
      if (window.soundEngine && typeof window.soundEngine.jackpot === 'function') {
        window.soundEngine.jackpot();
      }
    }

    // 4. Card drawn notification popup box (matching Richup.io user screenshot)
    let cardShown = false;
    if (curr.last_card && (!prev.last_card || prev.last_card.id !== curr.last_card.id || prev.last_card.desc !== curr.last_card.desc)) {
      const cardType = curr.last_card.type === 'chance' ? 'surprise' : 'treasure';
      const cardText = curr.last_card.desc || curr.last_card.title;
      this.showCardPopup(cardText, cardType);
      cardShown = true;
      if (window.soundEngine && typeof window.soundEngine.cardEffect === 'function') {
        window.soundEngine.cardEffect();
      }
    }

    // Fallback: Check newLogs for card draw events
    if (!cardShown) {
      const cardLog = newLogs.find(l =>
        l.category === 'card' ||
        (l.text && (l.text.includes('drew ') || l.text.includes('Surprise:') || l.text.includes('Treasure:')))
      );
      if (cardLog) {
        let cardText = cardLog.text;
        if (cardText.includes(': ')) {
          cardText = cardText.substring(cardText.indexOf(': ') + 2);
        }
        const isSurprise = cardLog.text.toLowerCase().includes('surprise') || cardLog.text.toLowerCase().includes('chance');
        this.showCardPopup(cardText, isSurprise ? 'surprise' : 'treasure');
        if (window.soundEngine && typeof window.soundEngine.cardEffect === 'function') {
          window.soundEngine.cardEffect();
        }
      }
    }

    // 5. Newly acquired property sound effect
    if (curr.tile_states && prev.tile_states) {
      let anyBought = false;
      Object.keys(curr.tile_states).forEach(tid => {
        const cState = curr.tile_states[tid];
        const pState = prev.tile_states[tid];
        if (cState && cState.owner && (!pState || !pState.owner)) {
          anyBought = true;
        }
      });
      if (anyBought && window.soundEngine && typeof window.soundEngine.propertyBought === 'function') {
        window.soundEngine.propertyBought();
      }
    }

    // 6. Jackpot change sound
    if (curr.free_parking_pool > (prev.free_parking_pool || 0)) {
      window.soundEngine.moneyGain();
    }

    // 7. Flying cash delta (+/- flying text for 2 sec, deduplicated)
    if (curr.players) {
      curr.players.forEach(p => {
        const prevCash = this.previousCash[p.id];
        if (prevCash !== undefined && prevCash !== p.cash) {
          const diff = p.cash - prevCash;
          const now = Date.now();
          if (!this.lastCashDeltaEvent) this.lastCashDeltaEvent = {};
          const last = this.lastCashDeltaEvent[p.id];
          if (!last || last.diff !== diff || (now - last.time) > 1500) {
            this.lastCashDeltaEvent[p.id] = { diff: diff, time: now };
            this.triggerCashDeltaAnimation(p, diff);
          }
        }
        this.previousCash[p.id] = p.cash;
      });
    }

    // 8. Live Vacation pool on board tile
    const tileVacEl = document.getElementById('tile-vacation-pool');
    if (tileVacEl) {
      tileVacEl.innerText = `$${curr.free_parking_pool || 0}`;
    }
  }

  showCardPopup(text, type = 'treasure', playerName = null) {
    const popup = document.getElementById('richup-card-popup');
    const textEl = document.getElementById('card-popup-text');
    if (!popup || !textEl || !text) return;

    let formattedText = text;
    const pName = playerName || (this.gameState && this.gameState.players && this.gameState.players[this.gameState.current_player_idx] ? this.gameState.players[this.gameState.current_player_idx].name : '');
    if (pName) {
      formattedText = formattedText.replace(/^You won\b/i, `${pName} won`);
      formattedText = formattedText.replace(/^You have won\b/i, `${pName} won`);
      formattedText = formattedText.replace(/\byou won\b/gi, `${pName} won`);
      formattedText = formattedText.replace(/\byour favor\b/gi, `${pName}'s favor`);
      formattedText = formattedText.replace(/\byou get\b/gi, `${pName} receives`);
      formattedText = formattedText.replace(/\bYou inherit\b/gi, `${pName} inherits`);
    }

    textEl.innerText = formattedText;
    popup.className = `richup-card-popup ${type === 'surprise' ? 'popup-surprise' : (type === 'vacation' ? 'popup-vacation' : '')}`;
    popup.style.display = 'flex';
    if (this.cardPopupTimeout) clearTimeout(this.cardPopupTimeout);
    this.cardPopupTimeout = setTimeout(() => {
      this.closeCardPopup();
    }, 4500);
  }

  closeCardPopup() {
    const popup = document.getElementById('richup-card-popup');
    if (popup) popup.style.display = 'none';
    if (this.cardPopupTimeout) clearTimeout(this.cardPopupTimeout);
  }

  // ================= Board Skeleton & Tile Rendering (Matching User's Image 1-1) =================
  renderBoardSkeleton() {
    const board = document.getElementById('monopoly-board');
    if (!board || !this.boardData) return;

    // Remove existing tile slots, keeping .board-center inside the grid
    board.querySelectorAll('.tile').forEach(el => el.remove());

    const tiles = this.boardData.tiles;
    const totalTiles = tiles.length; // 40 (standard) or 48 (extended)
    const isExtended = totalTiles === 48;
    board.classList.toggle('map-extended', isExtended);
    board.classList.toggle('map-classic', !isExtended);

    const sideLen = Math.floor(totalTiles / 4); // 10 for std, 12 for ext
    const gridSize = sideLen + 1; // 11 for std, 13 for ext

    const jailId = isExtended ? 12 : 10;
    const vacationId = isExtended ? 24 : 20;
    const gotojailId = isExtended ? 36 : 30;

    const centerEl = board.querySelector('.board-center');
    if (centerEl) {
      if (isExtended) {
        centerEl.style.gridColumn = '2 / span 11';
        centerEl.style.gridRow = '2 / span 11';
      } else {
        centerEl.style.gridColumn = '2 / span 9';
        centerEl.style.gridRow = '2 / span 9';
      }
    }

    let html = '';

    tiles.forEach((tile, index) => {
      const id = tile.id;
      let extraClass = `tile-${id}`;
      let content = '';

      // Grid position and edge orientation
      let col = 1, row = 1;
      let edgeClass = '';

      if (index === 0) {
        col = 1; row = 1;
      } else if (index < sideLen) {
        row = 1; col = 1 + index;
        edgeClass = 'edge-top';
      } else if (index === sideLen) {
        col = gridSize; row = 1;
      } else if (index < 2 * sideLen) {
        col = gridSize; row = 1 + (index - sideLen);
        edgeClass = 'edge-right';
      } else if (index === 2 * sideLen) {
        col = gridSize; row = gridSize;
      } else if (index < 3 * sideLen) {
        row = gridSize; col = gridSize - (index - 2 * sideLen);
        edgeClass = 'edge-bottom';
      } else if (index === 3 * sideLen) {
        col = 1; row = gridSize;
      } else {
        col = 1; row = gridSize - (index - 3 * sideLen);
        edgeClass = 'edge-left';
      }

      if (id === 0) {
        extraClass += ' tile-corner tile-corner-start';
        content = `
          <div class="corner-start-box">
            <div class="start-text-glow">START</div>
            <div class="start-arrow-badge">➜</div>
          </div>
        `;
      } else if (id === jailId) {
        extraClass += ' tile-corner tile-corner-jail';
        content = `
          <div class="corner-jail-box">
            <div class="corner-jail-passing">Passing by</div>
            <div class="corner-jail-cell">
              ${getCartoonJailSvg()}
              <div class="corner-jail-label">In Prison</div>
            </div>
          </div>
        `;
      } else if (id === vacationId) {
        extraClass += ' tile-corner tile-corner-vacation';
        const curPool = (this.gameState && this.gameState.free_parking_pool) ? this.gameState.free_parking_pool : 0;
        content = `
          <div class="corner-vacation-box">
            <div class="corner-vacation-icon">${getVacationSvg()}</div>
            <div class="corner-vacation-title">Vacation</div>
            <div class="vacation-jackpot-pill" id="tile-vacation-pool">$${curPool}</div>
          </div>
        `;
      } else if (id === gotojailId) {
        extraClass += ' tile-corner tile-corner-gotojail';
        content = `
          <div class="corner-gotojail-box">
            <div class="corner-gotojail-icon">${getCartoonSkullSvg()}</div>
            <div class="corner-gotojail-title">Go to prison</div>
          </div>
        `;
      } else {
        extraClass += ' ' + edgeClass;
        if (tile.country_code === 'GAS') extraClass += ' tile-special-gas';
        else if (tile.type === 'chest') extraClass += ' tile-chest';
        else if (tile.type === 'chance') extraClass += ' tile-chance';
        else if (tile.type === 'railroad') extraClass += ' tile-railroad';
        else if (tile.type === 'tax') extraClass += ' tile-tax';
        else if (tile.type === 'utility') extraClass += ' tile-utility';

        let colorBar = '';
        if (tile.type === 'property' || tile.type === 'railroad' || tile.type === 'utility') {
          colorBar = `<div class="color-bar" id="colorbar-tile-${id}"></div>`;
        }

        let priceText = '';
        if (tile.price) {
          priceText = `${tile.price}$`;
        } else if (tile.tax_amount) {
          priceText = (tile.country_code === 'TAX' || (tile.name && tile.name.toLowerCase().includes('earnings'))) ? '%10' : `${tile.tax_amount}$`;
        }

        // Circular Flag / Symbol SVG Badge
        let flagCode = tile.country_code;
        if (!flagCode) {
          if (tile.type === 'chest') flagCode = 'CHEST';
          else if (tile.type === 'chance') flagCode = 'CHANCE';
          else if (tile.type === 'tax') flagCode = (tile.name && tile.name.toLowerCase().includes('premium')) ? 'PREMIUM_TAX' : 'TAX';
        }
        const flagCircle = `<div class="richup-flag-circle">${getCircularFlagSvg(flagCode)}</div>`;

        // Price tag in translucent rounded pill
        const priceTag = priceText ? `<div class="richup-price-tag" id="price-tag-tile-${id}">${priceText}</div>` : `<div class="richup-price-tag" id="price-tag-tile-${id}" style="display:none;"></div>`;

        // City name
        const tileInfo = `
          <div class="richup-tile-info">
            <div class="richup-city-name" title="${tile.name}">${tile.name}</div>
          </div>
        `;

        // Inner layout matches Richup.io screenshot
        content = `
          ${colorBar}
          <div class="house-container" id="houses-tile-${id}"></div>
          ${priceTag}
          ${tileInfo}
          ${flagCircle}
          <div class="owner-indicator" id="owner-tile-${id}"></div>
          <div class="mortgaged-overlay" id="mortgage-tile-${id}" style="display:none;">
            <span class="mortgage-label">MORTGAGED</span>
          </div>
        `;
      }

      html += `
        <div class="tile ${extraClass}" id="tile-slot-${id}" style="grid-column:${col}; grid-row:${row};" onclick="game.inspectProperty(${id})">
          ${content}
          <div class="tokens-container" id="tokens-tile-${id}"></div>
        </div>
      `;
    });

    if (centerEl) {
      centerEl.insertAdjacentHTML('beforebegin', html);
    } else {
      board.innerHTML = html;
    }
  }

  renderTileStates() {
    if (!this.gameState || !this.boardData) return;

    const tileStates = this.gameState.tile_states;
    const playersById = {};
    this.gameState.players.forEach(p => { playersById[p.id] = p; });

    const colorGroups = this.boardData.color_groups || {
      brown: { color: '#7c3aed' },
      lightblue: { color: '#38bdf8' },
      pink: { color: '#06b6d4' },
      orange: { color: '#f97316' },
      red: { color: '#ef4444' },
      yellow: { color: '#ec4899' },
      green: { color: '#8b5cf6' },
      darkblue: { color: '#2563eb' },
      railroad: { color: '#64748b' },
      utility: { color: '#eab308' }
    };

    this.boardData.tiles.forEach(tile => {
      const state = tileStates[tile.id];
      if (!state) return;

      const tileSlot = document.getElementById(`tile-slot-${tile.id}`);
      const colorBar = tileSlot ? tileSlot.querySelector('.color-bar') : null;
      const ownerEl = document.getElementById(`owner-tile-${tile.id}`);
      const priceEl = document.getElementById(`price-tag-tile-${tile.id}`);

      // Property ownership styling matching warm board design (Classic & Extended):
      // Each unowned property shares the same warm parchment color with a slightly darker cream bar.
      // When owned by a player, ONLY the bar changes to that player's color with subtle glow, and price tag shows player color
      if (state.owner && playersById[state.owner]) {
        const owner = playersById[state.owner];
        if (colorBar) {
          colorBar.style.display = 'block';
          colorBar.style.setProperty('background-color', owner.color, 'important');
          colorBar.style.setProperty('border-color', owner.color, 'important');
          colorBar.style.boxShadow = `0 0 8px ${owner.color}80`;
        }
        if (tileSlot) {
          tileSlot.style.setProperty('background', `linear-gradient(135deg, ${owner.color}24 0%, #fcefd9 100%)`, 'important');
          tileSlot.style.setProperty('border-color', owner.color, 'important');
          tileSlot.style.boxShadow = `0 4px 14px ${owner.color}35`;
        }
        if (ownerEl) {
          ownerEl.style.display = 'none';
        }
      } else {
        if (colorBar) {
          colorBar.style.display = 'block';
          colorBar.style.setProperty('background-color', '#fce5c0', 'important');
          colorBar.style.setProperty('border-color', '#ebd0ad', 'important');
          colorBar.style.boxShadow = 'none';
        }
        if (tileSlot) {
          tileSlot.style.setProperty('background', '#fcefd9', 'important');
          tileSlot.style.setProperty('border-color', 'rgba(119, 65, 32, 0.28)', 'important');
          tileSlot.style.boxShadow = '';
        }
        if (ownerEl) {
          ownerEl.style.display = 'none';
        }
      }

      // 2. Mortgaged
      const mortEl = document.getElementById(`mortgage-tile-${tile.id}`);
      if (mortEl) {
        mortEl.style.display = state.mortgaged ? 'flex' : 'none';
      }

      // 3. Authentic Richup.io House, Hotel & Shop Unified Development Badges replacing price pill
      const houseEl = document.getElementById(`houses-tile-${tile.id}`);
      if (houseEl) {
        houseEl.innerHTML = '';
      }

      if (priceEl && (tile.type === 'property' || tile.type === 'railroad' || tile.type === 'utility')) {
        if (state.owner && playersById[state.owner]) {
          const owner = playersById[state.owner];
          const hasHouses = Boolean(state.houses && state.houses > 0);
          const hasShops = Boolean(state.shops && state.shops > 0);

          if (hasHouses || hasShops) {
            priceEl.style.display = 'inline-flex';
            priceEl.className = 'richup-price-tag richup-house-badge' + (state.houses === 5 ? ' hotel-badge' : '');
            priceEl.style.backgroundColor = owner.color;

            let badgeHtml = '';
            if (state.houses === 5) {
              badgeHtml += `<span class="badge-segment hotel-segment" title="Hotel Built"><svg viewBox="0 0 24 24" class="hotel-svg-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M3,2 H21 V4 H20 V21 H4 V4 H3 V2 Z M6,5 H8 V7 H6 V5 Z M11,5 H13 V7 H11 V5 Z M16,5 H18 V7 H16 V5 Z M6,9 H8 V11 H6 V9 Z M11,9 H13 V11 H11 V9 Z M16,9 H18 V11 H16 V9 Z M9,21 V16 C9,14.5 10.3,13.5 12,13.5 C13.7,13.5 15,14.5 15,16 V21 H9 Z" fill="#000000"/></svg></span>`;
            } else if (hasHouses) {
              badgeHtml += `<span class="badge-segment house-segment" title="${state.houses} House(s)"><svg viewBox="0 0 20 20" class="house-svg-icon"><path d="M10,2 L1.5,9.5 H4.5 V18 H15.5 V9.5 H18.5 Z" fill="#000000"/></svg><span class="house-badge-multiplier">× ${state.houses}</span></span>`;
            }

            if (hasHouses && hasShops) {
              badgeHtml += `<span class="dev-divider"></span>`;
            }

            if (hasShops) {
              badgeHtml += `<span class="badge-segment shop-segment" title="Advanced Shop Built"><img src="/img/shop.svg" class="shop-pill-icon" alt="Shop" /></span>`;
            }

            priceEl.innerHTML = badgeHtml;
          } else {
            // 0 houses, 0 shops: restore original price pill
            priceEl.className = 'richup-price-tag';
            priceEl.style.backgroundColor = owner.color;
            priceEl.style.color = '#ffffff';
            priceEl.style.borderColor = owner.color;
            priceEl.style.display = tile.price ? 'inline-flex' : 'none';
            priceEl.textContent = tile.price ? `${tile.price}$` : '';
          }
        } else {
          // Unowned: restore original price pill
          priceEl.className = 'richup-price-tag';
          priceEl.style.backgroundColor = '#ffffff';
          priceEl.style.color = '#2e1b10';
          priceEl.style.borderColor = 'rgba(119, 65, 32, 0.2)';
          priceEl.style.display = tile.price ? 'inline-flex' : 'none';
          priceEl.textContent = tile.price ? `${tile.price}$` : '';
        }
      }
    });
  }

  renderPlayerTokens() {
    if (!this.gameState) return;

    if (!this.animatingTokens) this.animatingTokens = {};
    const activePlayerIds = new Set();

    this.gameState.players.forEach(p => {
      activePlayerIds.add(p.id);

      if (p.is_bankrupt) {
        const existingToken = document.getElementById(`player-token-${p.id}`);
        if (existingToken) existingToken.remove();
        delete this.previousPositions[p.id];
        delete this.animatingTokens[p.id];
        return;
      }

      const prevPos = this.previousPositions[p.id];
      const targetPos = p.position;

      // Find or create player token element
      let token = document.getElementById(`player-token-${p.id}`);
      if (!token) {
        token = document.createElement('div');
        token.id = `player-token-${p.id}`;
        token.className = 'player-token token-spawn';
        token.innerHTML = `<span class="token-emoji">${p.avatar}</span>`;
      }
      const darkBorder = darkenColor(p.color, 0.35);
      token.style.backgroundColor = p.color;
      token.style.borderColor = darkBorder;
      token.style.setProperty('--pcolor', p.color);
      token.style.setProperty('--pdark', darkBorder);

      // Jail state: reduced brightness/contrast when in prison, returns to OG when fine paid / freed
      if (p.in_jail) {
        token.classList.add('in-jail');
        token.title = `${p.name} ⛓️ (In Jail: Pay $50, roll doubles, or use card)`;
      } else {
        token.classList.remove('in-jail');
        token.title = `${p.name} (${p.cash < 0 ? `-$${Math.abs(p.cash)}` : `$${p.cash}`})`;
      }

      // Disconnect status badge over token on the board
      let discBadge = token.querySelector('.token-disconnect-badge');
      if (!p.connected && p.disconnect_deadline) {
        const secs = p.disconnect_time_left !== null && p.disconnect_time_left !== undefined ? p.disconnect_time_left : Math.max(0, Math.ceil(p.disconnect_deadline - (Date.now() / 1000)));
        if (!discBadge) {
          discBadge = document.createElement('div');
          discBadge.className = 'token-disconnect-badge';
          token.appendChild(discBadge);
        }
        discBadge.innerText = `⚠️ ${secs}s`;
        discBadge.setAttribute('data-token-player-id', p.id);
        discBadge.setAttribute('data-deadline', p.disconnect_deadline);
      } else if (discBadge) {
        discBadge.remove();
      }

      // If token is currently animating to targetPos, let it complete smoothly without interruption
      if (this.animatingTokens[p.id] !== undefined) {
        return;
      }

      // If dice are currently rolling, hold token at previous position until dice settle
      if (this.isRolling && prevPos !== undefined) {
        const slot = document.getElementById(`tokens-tile-${prevPos}`);
        if (slot && token.parentElement !== slot) {
          slot.appendChild(token);
        }
        return;
      }

      // Initial placement (no prior recorded position) or position unchanged
      if (prevPos === undefined || prevPos === targetPos) {
        const slot = document.getElementById(`tokens-tile-${targetPos}`);
        if (slot && token.parentElement !== slot) {
          slot.appendChild(token);
        }
        this.previousPositions[p.id] = targetPos;
        return;
      }

      // Position changed -> check if card movement occurred with intermediate pause!
      const lastCard = this.gameState.last_card;
      if (lastCard && lastCard.intermediate_tile !== undefined && lastCard.destination_tile !== undefined && targetPos === lastCard.destination_tile) {
        const intermediateTile = lastCard.intermediate_tile;
        delete lastCard.intermediate_tile;
        this.animatePlayerSwishWithPause(p, token, prevPos, intermediateTile, targetPos, lastCard);
      } else {
        this.animatePlayerSwish(p, token, prevPos, targetPos);
      }
    });

    // Remove tokens for players who left or were removed
    document.querySelectorAll('.player-token').forEach(tok => {
      const pid = tok.id.replace('player-token-', '');
      if (!activePlayerIds.has(pid)) {
        tok.remove();
        delete this.previousPositions[pid];
        if (this.animatingTokens) delete this.animatingTokens[pid];
      }
    });
  }

  animatePlayerSwishWithPause(p, token, startPos, cardPos, endPos, card) {
    this.animatePlayerSwish(p, token, startPos, cardPos, () => {
      // Pause at the card tile so the player sees their token landing on Chance / Treasure!
      if (card) {
        const cardType = card.type === 'chance' ? 'surprise' : 'treasure';
        this.showCardPopup(card.desc || card.title, cardType);
        if (window.soundEngine && typeof window.soundEngine.cardEffect === 'function') {
          window.soundEngine.cardEffect();
        }
      }
      setTimeout(() => {
        this.animatePlayerSwish(p, token, cardPos, endPos);
      }, 1200);
    });
  }

  animatePlayerSwish(p, token, startPos, endPos, onComplete = null) {
    if (!this.activeSwishTimers) this.activeSwishTimers = {};
    if (this.activeSwishTimers[p.id]) {
      this.activeSwishTimers[p.id].forEach(t => clearTimeout(t));
      this.activeSwishTimers[p.id] = [];
    }
    this.activeSwishTimers[p.id] = [];

    if (!this.animatingTokens) this.animatingTokens = {};
    this.animatingTokens[p.id] = endPos;
    this.previousPositions[p.id] = endPos;

    // Compute step path along board
    let path = [];
    const totalTiles = this.boardData && this.boardData.tiles ? this.boardData.tiles.length : 40;
    const jailId = totalTiles === 48 ? 12 : 10;
    if (p.in_jail && endPos === jailId && startPos !== jailId - 1) {
      path = [jailId]; // Direct to jail
    } else {
      const fwdSteps = (endPos - startPos + totalTiles) % totalTiles;
      const bwdSteps = (startPos - endPos + totalTiles) % totalTiles;
      // If moving backwards (e.g. Go Back 3 spaces, where bwdSteps <= 5 && fwdSteps > 20)
      if (bwdSteps > 0 && bwdSteps <= 5 && fwdSteps > 20) {
        for (let s = 1; s <= bwdSteps; s++) {
          path.push((startPos - s + totalTiles) % totalTiles);
        }
      } else {
        for (let s = 1; s <= fwdSteps; s++) {
          path.push((startPos + s) % totalTiles);
        }
      }
    }

    if (path.length === 0) {
      delete this.animatingTokens[p.id];
      if (onComplete) onComplete();
      return;
    }

    // Smooth consistent step cadence: 110ms per tile hop
    const stepInterval = 110;

    path.forEach((tileIdx, idx) => {
      const timer = setTimeout(() => {
        const slot = document.getElementById(`tokens-tile-${tileIdx}`);
        if (slot) {
          slot.appendChild(token);
          token.classList.remove('swishing');
          token.classList.add('swishing');
          if (window.soundEngine && typeof window.soundEngine.swish === 'function') {
            window.soundEngine.swish();
          }
        }

        if (idx === path.length - 1) {
          delete this.animatingTokens[p.id];
          setTimeout(() => {
            token.classList.remove('swishing');
            this.renderCenterDeck();
            if (onComplete) onComplete();
          }, stepInterval);
        }
      }, idx * stepInterval);

      this.activeSwishTimers[p.id].push(timer);
    });
  }

  // ================= Center Command Deck =================
  renderCenterDeck() {
    if (!this.gameState) return;
    const state = this.gameState;
    const currPlayer = state.players[state.current_player_idx];
    const myPlayer = state.players.find(p => p.id === this.playerId);
    const isBankrupt = myPlayer && myPlayer.is_bankrupt;
    const isMyTurn = !this.isSpectator && !isBankrupt && currPlayer && currPlayer.id === this.playerId;

    // Active Market Event Banner
    const eventContainer = document.getElementById('active-event-container');
    if (eventContainer) {
      if (state.active_event) {
        const ev = state.active_event;
        eventContainer.innerHTML = `
          <div class="active-event-banner">
            <span class="event-banner-badge">⚡ MARKET EVENT</span>
            <span class="event-banner-title">${ev.emoji} ${ev.name} (${ev.remaining_rounds} ${ev.remaining_rounds === 1 ? 'round' : 'rounds'} left)</span>
            <span class="event-banner-desc">${ev.description}</span>
          </div>
        `;
        eventContainer.style.display = 'block';
      } else {
        eventContainer.innerHTML = '';
        eventContainer.style.display = 'none';
      }
    }

    // Turn indicator
    const turnPill = document.getElementById('center-turn-pill');
    if (turnPill) {
      turnPill.innerHTML = `
        <div class="pulse-dot" style="background:${currPlayer.color}"></div>
        <span>${isMyTurn ? 'Your Turn' : `${currPlayer.name}'s Turn`}</span>
      `;
    }

    // Turn timer - runs continuously until turn ends
    this.currentTurnTimeLeft = state.turn_time_left;
    const timerBox = document.getElementById('center-timer-box');
    if (timerBox) {
      timerBox.innerText = `${state.turn_time_left}s`;
      if (state.turn_time_left <= 10 || currPlayer.cash < 0) {
        timerBox.classList.add('urgent');
      } else {
        timerBox.classList.remove('urgent');
      }
      if (currPlayer.cash < 0) {
        timerBox.title = 'Resolve negative balance before timer expires!';
      } else {
        timerBox.title = `Turn time remaining: ${state.turn_time_left}s`;
      }
    }

    // Dice
    if (!this.isRolling && state.last_dice) {
      this.setDiceFaces(state.last_dice[0], state.last_dice[1]);
    }

    // Action buttons & prompt
    const promptEl = document.getElementById('center-status-prompt');
    const rollBtn = document.getElementById('btn-action-roll');
    const buyBtn = document.getElementById('btn-action-buy');
    const auctionBtn = document.getElementById('btn-action-auction');
    const passPropBtn = document.getElementById('btn-action-pass-property');
    const endTurnBtn = document.getElementById('btn-action-end');
    const jailFineBtn = document.getElementById('btn-action-jail-fine');
    const jailCardBtn = document.getElementById('btn-action-jail-card');
    const debtBtn = document.getElementById('btn-action-debt');
    const bankruptBtn = document.getElementById('btn-action-bankrupt');

    // Hide all action controls initially
    [rollBtn, buyBtn, auctionBtn, passPropBtn, endTurnBtn, jailFineBtn, jailCardBtn, debtBtn, bankruptBtn].forEach(b => {
      if (b) b.style.display = 'none';
    });

    if (this.isSpectator) {
      promptEl.innerText = `👁️ Spectating live game. Current turn: ${currPlayer.name}`;
      return;
    }

    if (isBankrupt) {
      promptEl.innerText = `👁️ You are eliminated (Bankrupt) - Spectating live game. Current turn: ${currPlayer.name}`;
      return;
    }

    // While dice are actively tumbling, display rolling status and hold action buttons
    if (this.isRolling) {
      if (promptEl) promptEl.innerText = `🎲 Rolling dice...`;
      return;
    }

    if (state.turn_phase === 'WAITING_ROLL') {
      promptEl.innerText = isMyTurn ? 'Roll the dice to move!' : `Waiting for ${currPlayer.name} to roll...`;
      if (isMyTurn) {
        if (currPlayer.in_jail) {
          promptEl.innerText = 'In Jail: Roll doubles, pay $50 fine, or use a card!';
          if (jailFineBtn && currPlayer.cash >= 50) jailFineBtn.style.display = 'flex';
          if (jailCardBtn && currPlayer.jail_cards > 0) jailCardBtn.style.display = 'flex';
        }
        if (rollBtn) rollBtn.style.display = 'flex';
      }
    } else if (state.turn_phase === 'LANDED_ACTION') {
      const tile = this.boardData.tiles[currPlayer.position];
      promptEl.innerText = `${currPlayer.name} landed on ${tile.name}!`;

      const auctionEnabled = Boolean(state.settings && state.settings.auction_on_decline);

      if (isMyTurn) {
        const canAfford = currPlayer.cash >= tile.price;
        if (buyBtn && canAfford) {
          buyBtn.innerHTML = `🏡 Buy ${tile.name} ($${tile.price})`;
          buyBtn.style.display = 'flex';
        }
        if (auctionBtn) {
          if (auctionEnabled) {
            auctionBtn.innerHTML = `⚖️ Start Auction`;
            auctionBtn.style.display = 'flex';
          } else {
            auctionBtn.style.display = 'none';
          }
        }
        if (passPropBtn) {
          passPropBtn.innerHTML = canAfford ? `⏭️ Pass / Don't Buy` : `⏭️ Pass`;
          passPropBtn.style.display = 'flex';
        }
        // If auction toggle is OFF and player is unable to buy:
        // "even when a player lands on a property he is unable to buy, he cannot auction and nothing happens and option to end the turn comes"
        if (!canAfford && !auctionEnabled) {
          if (auctionBtn) auctionBtn.style.display = 'none';
          if (passPropBtn) passPropBtn.style.display = 'none';
          if (endTurnBtn) {
            endTurnBtn.style.display = 'flex';
            endTurnBtn.disabled = false;
            endTurnBtn.innerHTML = `<span>⏭️ End Turn</span>`;
            endTurnBtn.style.opacity = '1';
            endTurnBtn.style.cursor = 'pointer';
          }
          promptEl.innerText = `You cannot afford ${tile.name} ($${tile.price}). Pass turn.`;
        }
      }
    } else if (state.turn_phase === 'WAITING_END_TURN') {
      const inDebt = currPlayer && currPlayer.cash < 0;
      if (inDebt) {
        promptEl.innerHTML = isMyTurn
          ? `<div class="debt-warning-box">⚠️ <strong>Negative Balance: -$${Math.abs(currPlayer.cash)}</strong><br>You cannot end turn. Mortgage properties or trade to restore positive funds before time runs out, or bankruptcy will be declared!</div>`
          : `<span style="color:#ef4444;">${currPlayer.name} owes money (-$${Math.abs(currPlayer.cash)})</span> and must liquidate properties or trade...`;
      } else if (myPlayer && myPlayer.cash < 0 && !myPlayer.is_bankrupt) {
        promptEl.innerHTML = `<div class="debt-warning-box">⚠️ <strong>You are in debt: -$${Math.abs(myPlayer.cash)}!</strong><br>Mortgage properties or propose trades now to restore positive balance before your turn!</div>`;
      } else {
        promptEl.innerText = isMyTurn ? 'Manage properties or pass turn.' : `Waiting for ${currPlayer ? currPlayer.name : 'player'}...`;
      }
      if (isMyTurn && endTurnBtn) {
        endTurnBtn.style.display = 'flex';
        const isTokenMoving = Boolean(this.animatingTokens && Object.keys(this.animatingTokens).length > 0);
        if (isTokenMoving) {
          endTurnBtn.disabled = true;
          endTurnBtn.innerHTML = `<span>⏳ Moving...</span>`;
          endTurnBtn.style.opacity = '0.5';
          endTurnBtn.style.cursor = 'not-allowed';
        } else if (inDebt) {
          endTurnBtn.disabled = true;
          endTurnBtn.innerHTML = `<span>⚠️ Debt: -$${Math.abs(currPlayer.cash)} (Must Liquidate)</span>`;
          endTurnBtn.style.opacity = '0.5';
          endTurnBtn.style.cursor = 'not-allowed';
        } else {
          endTurnBtn.disabled = false;
          endTurnBtn.innerHTML = `<span>End Turn ➔</span>`;
          endTurnBtn.style.opacity = '1';
          endTurnBtn.style.cursor = 'pointer';
        }
      }
    } else if (state.turn_phase === 'AUCTION') {
      promptEl.innerText = 'Auction in progress!';
    } else if (state.turn_phase === 'DEBT') {
      promptEl.innerText = `${currPlayer.name} is in debt! Mortgage or sell houses to pay.`;
      if (isMyTurn) {
        if (debtBtn) debtBtn.style.display = 'flex';
        if (bankruptBtn) bankruptBtn.style.display = 'flex';
      }
    }
  }

  rotateDieToFace(die, val) {
    if (!die) return;
    const v = parseInt(val, 10) || 1;
    die.setAttribute('data-val', v);

    // Standard 3D orientation for each face
    const rotations = {
      1: { x: 0, y: 0 },
      2: { x: -90, y: 0 },
      3: { x: 0, y: -90 },
      4: { x: 0, y: 90 },
      5: { x: 90, y: 0 },
      6: { x: 0, y: 180 }
    };
    const rot = rotations[v] || { x: 0, y: 0 };
    die.style.transform = `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`;
  }

  setDiceFaces(d1, d2) {
    const die1 = document.getElementById('die-1');
    const die2 = document.getElementById('die-2');
    if (!die1 || !die2) return;

    this.rotateDieToFace(die1, d1);
    this.rotateDieToFace(die2, d2);

    const container = document.getElementById('dice-container');
    if (container) {
      if (d1 === d2 && d1 > 0) {
        container.classList.add('doubles-glow');
      } else {
        container.classList.remove('doubles-glow');
      }
    }
  }

  triggerDiceAnimation(targetD1, targetD2, onComplete = null) {
    if (this.diceTimeout1) clearTimeout(this.diceTimeout1);
    if (this.diceTimeout2) clearTimeout(this.diceTimeout2);

    this.isRolling = true;
    const die1 = document.getElementById('die-1');
    const die2 = document.getElementById('die-2');
    const shadow1 = document.getElementById('dice-shadow-1');
    const shadow2 = document.getElementById('dice-shadow-2');
    const container = document.getElementById('dice-container');

    if (container) container.classList.remove('doubles-glow');

    const d1 = parseInt(targetD1 || (this.gameState && this.gameState.last_dice ? this.gameState.last_dice[0] : 1), 10) || 1;
    const d2 = parseInt(targetD2 || (this.gameState && this.gameState.last_dice ? this.gameState.last_dice[1] : 1), 10) || 1;

    const rotations = {
      1: { x: 0, y: 0 },
      2: { x: -90, y: 0 },
      3: { x: 0, y: -90 },
      4: { x: 0, y: 90 },
      5: { x: 90, y: 0 },
      6: { x: 0, y: 180 }
    };

    const rot1 = rotations[d1] || { x: 0, y: 0 };
    const rot2 = rotations[d2] || { x: 0, y: 0 };

    // Play throw and table tumble sound
    window.soundEngine.diceRoll();

    const rollDuration = 820; // ms

    // Realistic physics keyframes: Arching trajectory, felt table impacts with squash, rebound, and seamless face alignment
    const keyframes1 = [
      { transform: 'translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale3d(1, 1, 1)', offset: 0, easing: 'cubic-bezier(0.2, 0.8, 0.35, 1)' },
      { transform: 'translate3d(-22px, -64px, 32px) rotateX(410deg) rotateY(360deg) rotateZ(145deg) scale3d(1.14, 1.14, 1.14)', offset: 0.22, easing: 'cubic-bezier(0.55, 0.05, 0.85, 0.45)' },
      { transform: 'translate3d(-14px, 0, 0) rotateX(810deg) rotateY(740deg) rotateZ(285deg) scale3d(1.18, 0.82, 1.18)', offset: 0.48, easing: 'cubic-bezier(0.2, 0.85, 0.4, 1)' },
      { transform: 'translate3d(-8px, -20px, 14px) rotateX(960deg) rotateY(940deg) rotateZ(330deg) scale3d(1.05, 1.05, 1.05)', offset: 0.70, easing: 'cubic-bezier(0.55, 0.08, 0.85, 0.5)' },
      { transform: `translate3d(-3px, 0, 0) rotateX(1072deg) rotateY(${1080 + rot1.y - 8}deg) rotateZ(356deg) scale3d(1.06, 0.94, 1.06)`, offset: 0.88, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' },
      { transform: `translate3d(-1px, -2px, 2px) rotateX(${1080 + rot1.x}deg) rotateY(${1080 + rot1.y}deg) rotateZ(360deg) scale3d(1.01, 1, 1.01)`, offset: 0.95 },
      { transform: `translate3d(0, 0, 0) rotateX(${1080 + rot1.x}deg) rotateY(${1080 + rot1.y}deg) rotateZ(360deg) scale3d(1, 1, 1)`, offset: 1 }
    ];

    const keyframes2 = [
      { transform: 'translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale3d(1, 1, 1)', offset: 0, easing: 'cubic-bezier(0.2, 0.8, 0.35, 1)' },
      { transform: 'translate3d(24px, -68px, 35px) rotateX(-390deg) rotateY(-380deg) rotateZ(-155deg) scale3d(1.15, 1.15, 1.15)', offset: 0.22, easing: 'cubic-bezier(0.55, 0.05, 0.85, 0.45)' },
      { transform: 'translate3d(15px, 0, 0) rotateX(-790deg) rotateY(-760deg) rotateZ(-295deg) scale3d(1.2, 0.8, 1.2)', offset: 0.50, easing: 'cubic-bezier(0.2, 0.85, 0.4, 1)' },
      { transform: 'translate3d(9px, -22px, 16px) rotateX(-950deg) rotateY(-960deg) rotateZ(-335deg) scale3d(1.06, 1.06, 1.06)', offset: 0.72, easing: 'cubic-bezier(0.55, 0.08, 0.85, 0.5)' },
      { transform: `translate3d(4px, 0, 0) rotateX(-1070deg) rotateY(${-1080 + rot2.y + 8}deg) rotateZ(-358deg) scale3d(1.06, 0.94, 1.06)`, offset: 0.90, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' },
      { transform: `translate3d(1px, -2px, 2px) rotateX(${-1080 + rot2.x}deg) rotateY(${-1080 + rot2.y}deg) rotateZ(-360deg) scale3d(1.01, 1, 1.01)`, offset: 0.96 },
      { transform: `translate3d(0, 0, 0) rotateX(${-1080 + rot2.x}deg) rotateY(${-1080 + rot2.y}deg) rotateZ(-360deg) scale3d(1, 1, 1)`, offset: 1 }
    ];

    const shadowKeyframes1 = [
      { transform: 'translateX(-50%) scale(1)', opacity: 0.7, filter: 'blur(1.5px)' },
      { transform: 'translateX(-50%) scale(0.48) translateY(5px)', opacity: 0.16, filter: 'blur(6px)' },
      { transform: 'translateX(-50%) scale(1.22)', opacity: 0.88, filter: 'blur(1px)' },
      { transform: 'translateX(-50%) scale(0.72) translateY(2px)', opacity: 0.35, filter: 'blur(4px)' },
      { transform: 'translateX(-50%) scale(1.08)', opacity: 0.8, filter: 'blur(1.2px)' },
      { transform: 'translateX(-50%) scale(1)', opacity: 0.7, filter: 'blur(1.5px)' }
    ];

    const shadowKeyframes2 = [
      { transform: 'translateX(-50%) scale(1)', opacity: 0.7, filter: 'blur(1.5px)' },
      { transform: 'translateX(-50%) scale(0.45) translateY(6px)', opacity: 0.15, filter: 'blur(6.5px)' },
      { transform: 'translateX(-50%) scale(1.25)', opacity: 0.9, filter: 'blur(1px)' },
      { transform: 'translateX(-50%) scale(0.7)', opacity: 0.32, filter: 'blur(4.5px)' },
      { transform: 'translateX(-50%) scale(1.08)', opacity: 0.8, filter: 'blur(1.2px)' },
      { transform: 'translateX(-50%) scale(1)', opacity: 0.7, filter: 'blur(1.5px)' }
    ];

    try {
      if (die1 && die1.animate) {
        die1.animate(keyframes1, { duration: rollDuration, fill: 'forwards' });
      }
      if (die2 && die2.animate) {
        die2.animate(keyframes2, { duration: rollDuration, fill: 'forwards' });
      }
      if (shadow1 && shadow1.animate) {
        shadow1.animate(shadowKeyframes1, { duration: rollDuration, fill: 'forwards' });
      }
      if (shadow2 && shadow2.animate) {
        shadow2.animate(shadowKeyframes2, { duration: rollDuration, fill: 'forwards' });
      }
    } catch (e) {
      console.warn('Web Animations fallback:', e);
    }

    this.diceTimeout1 = setTimeout(() => {
      this.setDiceFaces(d1, d2);
      window.soundEngine.diceResult();

      // Brief pause (240ms) so players see the rolled 3D dice result before tokens move
      this.diceTimeout2 = setTimeout(() => {
        this.isRolling = false;
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }, 240);
    }, rollDuration);
  }

  // ================= Completed Monopoly Set Animation =================
  triggerMonopolySetHighlight(player, groupKey) {
    if (!this.boardData || !this.boardData.color_groups) return;
    const groupInfo = this.boardData.color_groups[groupKey];
    if (!groupInfo || !groupInfo.tiles) return;

    window.soundEngine.monopolySet();

    // 1. Highlight all tiles in the completed group on the map for 2 seconds
    groupInfo.tiles.forEach(tid => {
      const tileEl = document.getElementById(`tile-${tid}`);
      if (tileEl) {
        tileEl.classList.add('monopoly-set-highlight');
      }
    });

    // 2. Display celebratory floating banner toast
    const existing = document.getElementById('monopoly-toast-banner');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'monopoly-toast-banner';
    toast.className = 'monopoly-celebration-toast';
    toast.innerHTML = `👑 <span><strong>${player.name}</strong> completed the <strong>${groupInfo.name}</strong> set! (x2 Rent!)</span>`;
    document.body.appendChild(toast);

    // 3. Remove highlight and toast after exactly 2 seconds
    setTimeout(() => {
      groupInfo.tiles.forEach(tid => {
        const tileEl = document.getElementById(`tile-${tid}`);
        if (tileEl) {
          tileEl.classList.remove('monopoly-set-highlight');
        }
      });
      setTimeout(() => {
        if (toast && toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }, 2000);
  }

  // ================= Sidebar (Players & Event Feed) =================
  renderSidebar() {
    try {
      if (!this.gameState) return;
      const playersListEl = document.getElementById('sidebar-players-list');
      const currentId = this.gameState.current_player_id;

      if (playersListEl) {
        playersListEl.innerHTML = this.gameState.players.map(p => {
          const isActive = p.id === currentId;
          const isSelf = p.id === this.playerId;

          // Construct properties list for hover popover
          let popoverItemsHtml = '';
          if (p.properties && p.properties.length > 0) {
            popoverItemsHtml = p.properties.map(tid => {
              const tile = this.boardData && this.boardData.tiles ? this.boardData.tiles[tid] : null;
              if (!tile) return '';
              const state = this.gameState && this.gameState.tile_states ? this.gameState.tile_states[tid] : null;
              if (!state) return '';
              const gColor = tile.group && this.boardData.color_groups && this.boardData.color_groups[tile.group] ? this.boardData.color_groups[tile.group].color : '#888';
              const flagSvg = getCircularFlagSvg(tile.country_code);

              let statusBadge = '';
              if (state.mortgaged) {
                statusBadge = '<span class="popover-badge-jail">MORTGAGED</span>';
              } else if (p.in_jail && this.gameState.settings && this.gameState.settings.no_rent_in_prison) {
                statusBadge = '<span class="popover-badge-jail">⛓️ $0 (In Prison)</span>';
              } else if (state.houses === 5) {
                statusBadge = '<span style="color:#ef4444;font-weight:700;">🏨 Hotel</span>';
              } else if (state.houses > 0) {
                statusBadge = `<span style="color:#22c55e;font-weight:700;">🏠×${state.houses}</span>`;
              } else if (tile.type === 'property' && p.monopolies && p.monopolies.includes(tile.group) && this.gameState.settings && this.gameState.settings.double_rent_full_set && tile.rent && Array.isArray(tile.rent)) {
                statusBadge = `<span class="popover-badge-x2">x2 Rent ($${(tile.rent[0] || 0) * 2})</span>`;
              } else if (tile.rent && Array.isArray(tile.rent)) {
                statusBadge = `<span style="color:#cbd5e1;">Rent: $${tile.rent[0] || 0}</span>`;
              } else if (tile.type === 'railroad') {
                statusBadge = '<span style="color:#cbd5e1;">Rent: $25-$200</span>';
              } else if (tile.type === 'utility') {
                const totalUtil = (this.boardData && this.boardData.color_groups && this.boardData.color_groups.utility)
                  ? this.boardData.color_groups.utility.tiles.length : 2;
                const numUtil = p.properties ? p.properties.filter(id => this.boardData.tiles[id] && this.boardData.tiles[id].type === 'utility').length : 0;
                const currentMult = numUtil >= 3 ? 15 : (numUtil === 2 ? 10 : (numUtil === 1 ? 4 : 0));
                statusBadge = currentMult > 0
                  ? `<span style="color:#22c55e;font-weight:700;">${currentMult}× Dice</span>`
                  : `<span style="color:#cbd5e1;">Rent: 4x/10x${totalUtil >= 3 ? '/15x' : ''} Dice</span>`;
              } else {
                statusBadge = '<span style="color:#cbd5e1;">Rent: $0</span>';
              }

              return `
                <div class="popover-item" style="border-left-color:${gColor};">
                  <div class="popover-item-left">
                    <div class="richup-flag-circle" style="width:20px;height:20px;min-width:20px;min-height:20px;">${flagSvg}</div>
                    <div>
                      <strong style="color:#fff;">${tile.name}</strong>
                      <div style="font-size:0.65rem;color:var(--text-dim);">${tile.country || ''}</div>
                    </div>
                  </div>
                  <div>${statusBadge}</div>
                </div>
              `;
            }).join('');
          } else {
            popoverItemsHtml = '<div style="color:var(--text-dim);font-size:0.75rem;padding:6px;text-align:center;">No properties owned yet</div>';
          }

          return `
            <div class="player-card ${isActive ? 'active-turn' : ''} ${p.is_bankrupt ? 'bankrupt' : ''}" id="player-card-${p.id}" onclick="game.openPlayerDetails('${p.id}')">
              <!-- Floating Hover Popover listing all properties -->
              <div class="player-hover-popover">
                <div class="popover-header">
                  <span>${p.name}'s Properties (${p.properties ? p.properties.length : 0})</span>
                  ${p.in_jail ? '<span class="prison-indicator">In Prison</span>' : ''}
                </div>
                <div style="display:flex;flex-direction:column;gap:6px;">
                  ${popoverItemsHtml}
                </div>
              </div>

              <div class="player-card-top">
                <div class="player-info-left">
                  <div class="player-avatar-small ${p.in_jail ? 'in-jail' : ''}" style="background-color:${p.color};border-color:${darkenColor(p.color, 0.35)};">${p.avatar}</div>
                  <div class="player-name-col">
                    <div class="player-name-text">
                      ${p.name}
                      ${this.gameState.settings && this.gameState.settings.game_mode === 'alliances' && p.team_id && this.gameState.teams && this.gameState.teams[p.team_id] ? `
                        <span class="player-status-badge badge-alliance" style="color:${this.gameState.teams[p.team_id].color};">🤝 ${this.escapeHtml(this.gameState.teams[p.team_id].name)}</span>
                      ` : ''}
                      ${p.is_bot ? '<span class="player-status-badge badge-bot">BOT</span>' : ''}
                      ${p.in_jail ? '<span class="player-status-badge badge-jail">JAIL</span>' : ''}
                      ${p.vacation_skip ? '<span class="player-status-badge badge-vacation">🌴 VACATION</span>' : ''}
                      ${p.cash < 0 ? '<span class="player-status-badge badge-debt">DEBT</span>' : ''}
                      ${p.is_bankrupt ? '<span class="player-status-badge badge-bankrupt">BANKRUPT</span>' : ''}
                      ${!p.connected && p.disconnect_deadline ? `
                        <span class="disconnect-timer-badge" data-player-id="${p.id}" data-deadline="${p.disconnect_deadline}">
                          ⚠️ Offline (${p.disconnect_time_left !== null && p.disconnect_time_left !== undefined ? p.disconnect_time_left : Math.max(0, Math.ceil(p.disconnect_deadline - (Date.now() / 1000)))}s)
                        </span>
                      ` : ''}
                    </div>
                    <div class="player-networth">Net Worth: ${p.net_worth < 0 ? `-$${Math.abs(p.net_worth)}` : `$${p.net_worth}`}</div>
                  </div>
                </div>
                <div class="player-financials">
                  <div class="player-cash ${p.cash < 0 ? 'negative-debt' : ''}" id="player-cash-${p.id}">
                    ${p.cash < 0 ? `-$${Math.abs(p.cash)}` : `$${p.cash}`}
                  </div>
                </div>
              </div>

              <!-- Compact summary bar hiding raw properties list by default -->
              <div class="player-prop-summary-bar">
                <div style="display:flex;align-items:center;gap:6px;">
                  <div class="prop-count-pill">
                    <span>🏠 ${p.properties ? p.properties.length : 0} Properties</span>
                  </div>
                  ${p.monopolies && p.monopolies.length > 0 ? `
                    <div class="prop-count-pill" style="border-color:#f59e0b;color:#facc15;">
                      <span>👑 ${p.monopolies.length} Monopoly</span>
                    </div>
                  ` : ''}
                  ${p.in_jail ? `
                    <span class="prison-indicator">⛓️ In Prison</span>
                  ` : ''}
                </div>
                <div class="view-profile-hint">Hover for list • Click for details ↗</div>
              </div>

              ${!isSelf && !p.is_bankrupt && this.gameState.state === 'PLAYING' && !this.isSpectator ? `
                <div class="player-card-actions" style="margin-top:4px;" onclick="event.stopPropagation();">
                  <button class="mini-trade-btn" onclick="game.openTradeDesk('${p.id}')">🤝 Propose Trade</button>
                </div>
              ` : ''}
            </div>
          `;
        }).join('');

        // Re-attach any in-flight floating delta without restarting its CSS animation
        if (this.activeCashDeltaNodes) {
          Object.keys(this.activeCashDeltaNodes).forEach(pId => {
            const node = this.activeCashDeltaNodes[pId];
            const cashEl = document.getElementById(`player-cash-${pId}`);
            if (cashEl && node && !node.isConnected) {
              cashEl.appendChild(node);
            }
          });
        }
      }
    } catch (e) {
      console.error('Error in renderSidebar:', e);
    }

    // Activity log feed (Real-time game event log only - no chat per instructions)
    const logStreamEl = document.getElementById('log-stream');
    if (logStreamEl && this.gameState.logs) {
      logStreamEl.innerHTML = this.gameState.logs.map(log => `
        <div class="log-entry ${log.category}">
          <span class="log-icon">${log.icon || '🎲'}</span>
          <span class="log-text">${log.text}</span>
        </div>
      `).join('');
      logStreamEl.scrollTop = logStreamEl.scrollHeight;
    }

    // Toggle voluntary bankruptcy button in sidebar
    const bankruptSideBtn = document.getElementById('btn-voluntary-bankruptcy');
    if (bankruptSideBtn) {
      const myP = this.gameState.players.find(p => p.id === this.playerId);
      if (this.isSpectator || !myP || myP.is_bankrupt || this.gameState.state !== 'PLAYING') {
        bankruptSideBtn.style.display = 'none';
      } else {
        bankruptSideBtn.style.display = 'block';
      }
    }

    // Allow host to return room to lobby if eliminated early
    let hostResetBtn = document.getElementById('btn-host-reset-lobby');
    const myP = this.gameState.players.find(p => p.id === this.playerId);
    if (this.isHost && myP && myP.is_bankrupt && this.gameState.state === 'PLAYING') {
      if (!hostResetBtn) {
        const sideBarActions = document.querySelector('.sidebar-action-bar');
        if (sideBarActions) {
          hostResetBtn = document.createElement('button');
          hostResetBtn.id = 'btn-host-reset-lobby';
          hostResetBtn.className = 'btn-sidebar-secondary';
          hostResetBtn.style.color = '#38bdf8';
          hostResetBtn.style.borderColor = 'rgba(56, 189, 248, 0.4)';
          hostResetBtn.style.background = 'rgba(56, 189, 248, 0.12)';
          hostResetBtn.innerText = '🔄 Return Room to Lobby';
          hostResetBtn.onclick = () => this.restartGame();
          sideBarActions.appendChild(hostResetBtn);
        }
      } else {
        hostResetBtn.style.display = 'block';
      }
    } else if (hostResetBtn) {
      hostResetBtn.style.display = 'none';
    }

    // Render Trades, Auctions & Chat sidebar tabs
    this.renderTradesTab();
    this.renderAuctionsTab();
    this.renderChatMessages();
  }

  // ================= Detailed Player Profile Modal =================
  openPlayerDetails(playerId) {
    if (!this.gameState) return;
    const p = this.gameState.players.find(x => x.id === playerId);
    if (!p) return;

    const modal = document.getElementById('modal-player-detail');
    const nameEl = document.getElementById('player-detail-name');
    const avatarEl = document.getElementById('player-detail-avatar');
    const bodyEl = document.getElementById('player-detail-body');
    if (!modal || !nameEl || !bodyEl) return;

    nameEl.innerText = `${p.name}'s Financial Profile`;
    if (avatarEl) {
      avatarEl.innerText = p.avatar;
      avatarEl.style.backgroundColor = p.color;
      avatarEl.style.borderColor = darkenColor(p.color, 0.35);
      if (p.in_jail) {
        avatarEl.classList.add('in-jail');
      } else {
        avatarEl.classList.remove('in-jail');
      }
    }

    // Render properties grid
    let propsGridHtml = '';
    if (p.properties && p.properties.length > 0) {
      propsGridHtml = p.properties.map(tid => {
        const tile = this.boardData.tiles[tid];
        const state = this.gameState.tile_states[tid];
        const gColor = tile.group && this.boardData.color_groups[tile.group] ? this.boardData.color_groups[tile.group].color : '#888';
        const flagSvg = getCircularFlagSvg(tile.country_code);

        let rentDisplay = '';
        if (state.mortgaged) {
          rentDisplay = '<span style="color:#f87171;font-weight:700;">Mortgaged ($0)</span>';
        } else if (p.in_jail && this.gameState.settings && this.gameState.settings.no_rent_in_prison) {
          rentDisplay = '<span style="color:#f87171;font-weight:700;">$0 (In Prison)</span>';
        } else if (tile.type === 'utility') {
          const numUtil = p.properties ? p.properties.filter(id => this.boardData.tiles[id] && this.boardData.tiles[id].type === 'utility').length : 0;
          const mult = numUtil >= 3 ? 15 : (numUtil === 2 ? 10 : 4);
          rentDisplay = `<span style="color:#34d399;font-weight:700;">${mult}× Dice Roll</span>`;
        } else if (tile.type === 'railroad') {
          const numR = p.properties ? p.properties.filter(id => this.boardData.tiles[id] && this.boardData.tiles[id].type === 'railroad').length : 0;
          const rRent = numR === 1 ? 25 : (numR === 2 ? 50 : (numR === 3 ? 100 : (numR >= 4 ? 200 : 25)));
          rentDisplay = `<span style="color:#34d399;font-weight:700;">$${rRent}</span>`;
        } else if (state.houses === 5) {
          rentDisplay = `<span style="color:#34d399;font-weight:700;">$${tile.rent ? tile.rent[5] : 0} (Hotel)</span>`;
        } else if (state.houses > 0) {
          rentDisplay = `<span style="color:#34d399;font-weight:700;">$${tile.rent ? tile.rent[state.houses] : 0} (🏠×${state.houses})</span>`;
        } else if (p.monopolies && p.monopolies.includes(tile.group) && this.gameState.settings && this.gameState.settings.double_rent_full_set) {
          rentDisplay = `<span style="color:#fbbf24;font-weight:700;">$${tile.rent ? tile.rent[0] * 2 : 0} (x2 Full Set)</span>`;
        } else {
          rentDisplay = `<span style="color:#cbd5e1;font-weight:700;">$${tile.rent ? tile.rent[0] : 0}</span>`;
        }

        return `
          <div class="detail-prop-card">
            <div class="detail-prop-color" style="background-color:${gColor};"></div>
            <div class="detail-prop-content">
              <div class="detail-prop-header">
                <span>${tile.name}</span>
                <div class="richup-flag-circle" style="width:20px;height:20px;min-width:20px;min-height:20px;">${flagSvg}</div>
              </div>
              <div class="detail-prop-sub">
                <span>${tile.country || ''}</span>
              </div>
              <div class="detail-prop-stats">
                <span style="color:var(--text-dim);">Rent:</span>
                <span>${rentDisplay}</span>
              </div>
              <div class="detail-prop-stats" style="margin-top:2px;">
                <span style="color:var(--text-dim);">Mortgage:</span>
                <span style="color:#94a3b8;">$${tile.mortgage} (50%)</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      propsGridHtml = '<div style="grid-column:1/-1;text-align:center;color:var(--text-dim);padding:24px;">No properties owned yet.</div>';
    }

    const isSelf = p.id === this.playerId;

    bodyEl.innerHTML = `
      <!-- Financial Overview Cards -->
      <div class="detail-metrics-grid">
        <div class="metric-card">
          <span class="metric-label">Current Cash</span>
          <span class="metric-val cash" style="${p.cash < 0 ? 'color:#ef4444;' : ''}">$${p.cash}</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Total Asset Worth</span>
          <span class="metric-val networth">$${p.net_worth}</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Properties Value</span>
          <span class="metric-val">$${p.properties_value || 0}</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Monopolies</span>
          <span class="metric-val monopoly">${p.monopolies ? p.monopolies.length : 0}</span>
        </div>
      </div>

      <!-- Prison Warning Banner if In Prison -->
      ${p.in_jail ? `
        <div class="detail-prison-banner">
          <span>⛓️</span>
          <div>
            <strong>Player is in Prison!</strong> ${this.gameState.settings && this.gameState.settings.no_rent_in_prison ? 'Rent will not be collected when other players land on their properties.' : 'Rent is collected normally according to room rules.'}
          </div>
        </div>
      ` : ''}

      <!-- Properties Portfolio Title -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <span style="font-size:0.9rem;font-weight:700;color:#fff;">Owned Properties (${p.properties ? p.properties.length : 0})</span>
        <span style="font-size:0.75rem;color:var(--text-dim);">Even Build: ${this.gameState.settings && this.gameState.settings.even_build ? 'ON' : 'OFF'}</span>
      </div>

      <!-- Portfolio Grid -->
      <div class="detail-portfolio-grid">
        ${propsGridHtml}
      </div>

      <!-- Footer Action -->
      <div style="margin-top:16px;display:flex;justify-content:flex-end;gap:10px;">
        <button class="btn-secondary btn-modal-close" style="flex:none;padding:10px 18px;">Close</button>
        ${!isSelf && !p.is_bankrupt && this.gameState.state === 'PLAYING' && !this.isSpectator ? `
          <button class="btn-primary" style="flex:none;padding:10px 20px;" onclick="game.closeAllModals(); game.openTradeDesk('${p.id}');">
            🤝 Propose Trade Deal
          </button>
        ` : ''}
      </div>
    `;

    this.openModal('modal-player-detail');
  }

  // ================= Lobby Players View =================
  renderLobbyPlayers() {
    if (!this.gameState) return;
    const grid = document.getElementById('lobby-players-grid');
    if (!grid) return;

    grid.innerHTML = this.gameState.players.map(p => {
      const isSelf = p.id === this.playerId;
      return `
      <div class="setup-player-pill ${isSelf ? 'is-self' : ''}" style="border-color:${p.color};" title="${isSelf ? 'You - Click to change avatar icon' : `${p.name} (${p.is_bot ? 'Bot' : (p.id === this.gameState.host_id ? 'Host' : 'Player')})`}" ${isSelf ? 'onclick="game.openCustomAvatarModal()"' : ''}>
        <span class="avatar" style="background-color:${p.color};border-color:${darkenColor(p.color, 0.35)};">${p.avatar}</span>
        <span>${p.name} ${isSelf ? '<span style="font-size:0.75rem;opacity:0.8;" title="Change icon">✏️</span>' : ''}</span>
        ${this.isHost && p.id !== this.playerId ? `
          <button type="button" class="setup-player-kick" onclick="event.stopPropagation(); game.kickPlayer('${p.id}')" title="Kick">✕</button>
        ` : ''}
      </div>
    `;
    }).join('');

    // Update color picker options taking into account colors selected by others in this room
    const usedColors = new Set(this.gameState.players.filter(p => p.id !== this.playerId).map(p => p.color));
    document.querySelectorAll('.color-opt').forEach(opt => {
      const c = opt.getAttribute('data-color');
      if (usedColors.has(c)) {
        opt.classList.add('taken');
        opt.title = 'Color taken by another player';
      } else {
        opt.classList.remove('taken');
        opt.removeAttribute('title');
      }
    });

    const myPlayer = this.gameState.players.find(p => p.id === this.playerId);
    if (myPlayer && myPlayer.color) {
      this.selectedColor = myPlayer.color;
      document.querySelectorAll('.color-opt').forEach(opt => {
        if (opt.getAttribute('data-color') === myPlayer.color) {
          opt.classList.add('selected');
        } else {
          opt.classList.remove('selected');
        }
      });
    }

    // Toggle start game button enable/disable
    const startBtn = document.getElementById('btn-start-game');
    if (startBtn) {
      startBtn.style.display = this.isHost ? 'flex' : 'none';
      startBtn.disabled = this.gameState.players.length < 2;
    }

    // Render lobby chat & alliances panel
    this.renderChatMessages();
    this.renderAlliancesPanel();
  }

  escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  renderAlliancesPanel() {
    if (!this.gameState) return;
    const mode = (this.gameState.settings && this.gameState.settings.game_mode) || 'individual';
    const isAlliances = (mode === 'alliances');
    const container = document.querySelector('.richup-setup-container');
    const panel = document.getElementById('alliances-panel');
    if (container) container.classList.toggle('alliances-open', isAlliances);
    if (panel) panel.style.display = isAlliances ? 'flex' : 'none';
    if (!isAlliances) return;

    const listEl = document.getElementById('alliances-teams-list');
    const hintEl = document.getElementById('alliances-panel-hint');
    if (!listEl) return;

    // Avoid wiping an active team name input while the user is typing
    if (this.editingTeamId && document.activeElement && document.activeElement.id === `team-name-input-${this.editingTeamId}`) {
      return;
    }

    const teams = this.gameState.teams || {
      team_1: { id: 'team_1', name: 'Team Alpha', color: '#38bdf8' },
      team_2: { id: 'team_2', name: 'Team Omega', color: '#f43f5e' }
    };
    const players = this.gameState.players || [];
    const myPlayer = players.find(p => p.id === this.playerId);
    const myTeamId = myPlayer ? myPlayer.team_id : null;

    listEl.innerHTML = Object.values(teams).map(team => {
      const members = players.filter(p => p.team_id === team.id);
      const isMyTeam = (myTeamId === team.id);
      const isHostNotInTeam = this.isHost && !isMyTeam;
      const isEditing = (this.editingTeamId === team.id);

      return `
        <div class="alliance-team-box ${isHostNotInTeam ? 'clickable-space' : ''}"
             id="alliance-team-${team.id}"
             style="--team-color:${team.color};"
             onclick="game.handleTeamSpaceClick('${team.id}', event)"
             ondragover="game.onAllianceDragOver(event, '${team.id}')"
             ondragleave="game.onAllianceDragLeave(event, '${team.id}')"
             ondrop="game.onAllianceDrop(event, '${team.id}')">
          <div class="alliance-team-header" onclick="event.stopPropagation();">
            <div class="alliance-team-name-wrap">
              <span class="alliance-team-dot" style="background:${team.color};box-shadow:0 0 8px ${team.color};"></span>
              ${isEditing ? `
                <input type="text"
                       id="team-name-input-${team.id}"
                       class="alliance-team-name-input"
                       value="${this.escapeHtml(team.name)}"
                       maxlength="24"
                       onkeydown="if(event.key==='Enter'){event.preventDefault();game.saveTeamName('${team.id}');}else if(event.key==='Escape'){game.cancelEditTeamName();}"
                       onblur="game.saveTeamName('${team.id}')">
              ` : `
                <span class="alliance-team-name-text" title="${this.escapeHtml(team.name)}">${this.escapeHtml(team.name)}</span>
              `}
            </div>
            ${isMyTeam && !isEditing ? `
              <button type="button" class="alliance-edit-btn" onclick="game.startEditTeamName('${team.id}')" title="Edit your team name">✏️ Edit</button>
            ` : ''}
          </div>
          <div class="alliance-team-members">
            ${members.length > 0 ? members.map(p => {
              const isSelf = p.id === this.playerId;
              return `
                <div class="alliance-player-chip"
                     draggable="${this.isHost ? 'true' : 'false'}"
                     ondragstart="game.onAllianceDragStart(event, '${p.id}')"
                     onclick="event.stopPropagation();"
                     style="border-color:${p.color};"
                     title="${this.isHost ? 'Drag to move player to another team' : this.escapeHtml(p.name)}">
                  <span class="chip-avatar" style="background-color:${p.color};">${p.avatar}</span>
                  <span>${this.escapeHtml(p.name)}${isSelf ? ' (You)' : ''}${p.is_bot ? ' 🤖' : ''}</span>
                </div>
              `;
            }).join('') : `
              <div class="alliance-empty-slot">${this.isHost ? (isHostNotInTeam ? 'Click here to switch to this team or drag a player' : 'Drag players here') : 'No players in this team yet'}</div>
            `}
          </div>
        </div>
      `;
    }).join('');

    if (this.editingTeamId) {
      const inp = document.getElementById(`team-name-input-${this.editingTeamId}`);
      if (inp) {
        inp.focus();
        inp.select();
      }
    }

    if (hintEl) {
      hintEl.innerText = this.isHost
        ? 'Tip: Click another team space to switch your spot, or drag player icons to move them. Teammates can edit their team name.'
        : 'Wait for the room mod to organize teams. You can edit your own team name!';
    }
  }

  handleTeamSpaceClick(teamId, event) {
    if (!this.isHost || !this.gameState) return;
    if (event && event.target && event.target.closest('.alliance-player-chip, .alliance-team-header')) return;
    const myPlayer = (this.gameState.players || []).find(p => p.id === this.playerId);
    if (!myPlayer || myPlayer.team_id === teamId) return;
    this.sendAction({
      action: 'CHANGE_TEAM',
      targetPlayerId: this.playerId,
      teamId: teamId
    });
  }

  onAllianceDragStart(event, playerId) {
    if (!this.isHost) {
      event.preventDefault();
      return;
    }
    this.draggedAlliancePlayerId = playerId;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', playerId);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onAllianceDragOver(event, teamId) {
    if (!this.isHost) return;
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    const box = document.getElementById(`alliance-team-${teamId}`);
    if (box) box.classList.add('drag-over');
  }

  onAllianceDragLeave(event, teamId) {
    const box = document.getElementById(`alliance-team-${teamId}`);
    if (box) box.classList.remove('drag-over');
  }

  onAllianceDrop(event, teamId) {
    if (!this.isHost) return;
    event.preventDefault();
    const box = document.getElementById(`alliance-team-${teamId}`);
    if (box) box.classList.remove('drag-over');
    const playerId = (event.dataTransfer && event.dataTransfer.getData('text/plain')) || this.draggedAlliancePlayerId;
    this.draggedAlliancePlayerId = null;
    if (!playerId) return;
    this.sendAction({
      action: 'CHANGE_TEAM',
      targetPlayerId: playerId,
      teamId: teamId
    });
  }

  startEditTeamName(teamId) {
    this.editingTeamId = teamId;
    this.renderAlliancesPanel();
  }

  cancelEditTeamName() {
    this.editingTeamId = null;
    this.renderAlliancesPanel();
  }

  saveTeamName(teamId) {
    const inp = document.getElementById(`team-name-input-${teamId}`);
    const newName = inp ? inp.value.trim() : '';
    this.editingTeamId = null;
    if (newName) {
      this.sendAction({
        action: 'RENAME_TEAM',
        teamId: teamId,
        name: newName
      });
    } else {
      this.renderAlliancesPanel();
    }
  }

  kickPlayer(targetId) {
    this.sendAction({
      action: 'KICK_PLAYER',
      targetPlayerId: targetId
    });
  }

  // ================= Property Deed Inspector =================
  inspectProperty(tileId) {
    if (!this.boardData) return;
    const tile = this.boardData.tiles[tileId];
    if (!tile || (tile.type !== 'property' && tile.type !== 'railroad' && tile.type !== 'utility')) {
      return;
    }

    const state = this.gameState ? this.gameState.tile_states[tileId] : null;
    const owner = state && state.owner ? this.gameState.players.find(p => p.id === state.owner) : null;
    const isMine = state && state.owner === this.playerId;

    const modal = document.getElementById('modal-deed');
    const content = document.getElementById('deed-card-content');
    if (!modal || !content) return;

    let groupColor = '#3b82f6';
    if (tile.group && this.boardData.color_groups[tile.group]) {
      groupColor = this.boardData.color_groups[tile.group].color;
    }

    let rentSchedule = '';
    const houses = state ? (state.houses || 0) : 0;
    const isMortgaged = state && state.mortgaged;
    const hasMonopoly = owner && owner.monopolies && owner.monopolies.includes(tile.group);
    const doubleRentRule = !this.gameState || !this.gameState.settings || this.gameState.settings.double_rent_full_set !== false;
    const isDoubleRent = Boolean(hasMonopoly && doubleRentRule && houses === 0);

    if (tile.type === 'property' && tile.rent) {
      rentSchedule = `
        <table class="deed-rent-table">
          <tr class="${!isMortgaged && houses === 0 && !isDoubleRent ? 'current-rent-highlight' : ''}">
            <td>Rent</td><td>$${tile.rent[0]}</td>
          </tr>
          <tr class="${!isMortgaged && isDoubleRent ? 'current-rent-highlight' : ''}">
            <td>With Full Set (Unimproved)</td><td style="color:#fbbf24;">$${tile.rent[0] * 2} (x2)</td>
          </tr>
          <tr class="${!isMortgaged && houses === 1 ? 'current-rent-highlight' : ''}">
            <td>With 1 House</td><td>$${tile.rent[1]}</td>
          </tr>
          <tr class="${!isMortgaged && houses === 2 ? 'current-rent-highlight' : ''}">
            <td>With 2 Houses</td><td>$${tile.rent[2]}</td>
          </tr>
          <tr class="${!isMortgaged && houses === 3 ? 'current-rent-highlight' : ''}">
            <td>With 3 Houses</td><td>$${tile.rent[3]}</td>
          </tr>
          <tr class="${!isMortgaged && houses === 4 ? 'current-rent-highlight' : ''}">
            <td>With 4 Houses</td><td>$${tile.rent[4]}</td>
          </tr>
          <tr class="${!isMortgaged && houses === 5 ? 'current-rent-highlight' : ''}">
            <td>With Hotel</td><td>$${tile.rent[5]}</td>
          </tr>
        </table>
        <div class="deed-divider"></div>
        <div class="deed-info-row"><span>House Cost:</span><span>$${tile.house_cost} each</span></div>
        <div class="deed-info-row"><span>Hotel Cost:</span><span>$${tile.house_cost} plus 4 houses</span></div>
      `;
    } else if (tile.type === 'railroad') {
      const numRailroads = owner ? owner.properties.filter(id => this.boardData.tiles[id] && this.boardData.tiles[id].type === 'railroad').length : 0;
      rentSchedule = `
        <table class="deed-rent-table">
          <tr class="${!isMortgaged && numRailroads === 1 ? 'current-rent-highlight' : ''}"><td>Rent (1 Station)</td><td>$25</td></tr>
          <tr class="${!isMortgaged && numRailroads === 2 ? 'current-rent-highlight' : ''}"><td>Rent (2 Stations)</td><td>$50</td></tr>
          <tr class="${!isMortgaged && numRailroads === 3 ? 'current-rent-highlight' : ''}"><td>Rent (3 Stations)</td><td>$100</td></tr>
          <tr class="${!isMortgaged && numRailroads >= 4 ? 'current-rent-highlight' : ''}"><td>Rent (4 Stations)</td><td>$200</td></tr>
        </table>
      `;
    } else if (tile.type === 'utility') {
      const totalInGroup = (tile.group && this.boardData.color_groups && this.boardData.color_groups[tile.group])
        ? this.boardData.color_groups[tile.group].tiles.length
        : this.boardData.tiles.filter(t => t.type === 'utility').length;
      const numUtilities = owner ? owner.properties.filter(id => this.boardData.tiles[id] && this.boardData.tiles[id].type === 'utility').length : 0;

      let utilityRows = `
        <tr class="${!isMortgaged && numUtilities === 1 ? 'current-rent-highlight' : ''}">
          <td>Rent with 1 Utility</td>
          <td>4× Dice Roll</td>
        </tr>
        <tr class="${!isMortgaged && numUtilities === 2 ? 'current-rent-highlight' : ''}">
          <td>Rent with 2 Utilities</td>
          <td>10× Dice Roll</td>
        </tr>
      `;
      if (totalInGroup >= 3) {
        utilityRows += `
          <tr class="${!isMortgaged && numUtilities >= 3 ? 'current-rent-highlight' : ''}">
            <td>Rent with 3 Utilities</td>
            <td>15× Dice Roll</td>
          </tr>
        `;
      }

      rentSchedule = `
        <table class="deed-rent-table">
          ${utilityRows}
        </table>
      `;
    }

    const hasShop = Boolean(state && state.shops && state.shops > 0);
    const shopMortgageBoost = hasShop ? Math.floor((tile.house_cost || 100) * 0.6) : 0;
    let calculatedMortgage = (tile.mortgage || (tile.price ? tile.price / 2 : 0)) + shopMortgageBoost;
    if (this.gameState && this.gameState.active_event && this.gameState.active_event.id === 'REAL_ESTATE_BOOM') {
      calculatedMortgage = Math.floor(calculatedMortgage * 1.5);
    }
    const mortgageValue = calculatedMortgage;
    const flagSvg = getCircularFlagSvg(tile.country_code);

    content.innerHTML = `
      <div class="deed-card">
        <div class="deed-header" style="background-color:${groupColor};display:flex;align-items:center;justify-content:center;gap:12px;">
          <div class="richup-flag-circle" style="width:32px;height:32px;min-width:32px;min-height:32px;">${flagSvg}</div>
          <div>
            <div>${tile.name}</div>
            <div style="font-size:0.75rem;font-weight:600;opacity:0.9;">${tile.country || ''}</div>
          </div>
        </div>
        <div class="deed-subtitle">Title Deed</div>
        <div class="deed-info-row" style="background:#f1f5f9;padding:6px 10px;border-radius:6px;font-weight:700;margin-bottom:10px;">
          <span style="color:#475569;">Original Price:</span>
          <span style="color:#0f172a;font-size:0.95rem;">$${tile.price || 0}</span>
        </div>
        ${rentSchedule}
        <div class="deed-divider"></div>
        <div class="deed-info-row">
          <span>Mortgage Value:</span>
          <span>$${mortgageValue}${hasShop ? ' (includes shop)' : ''}</span>
        </div>
        ${tile.type === 'property' && (!this.gameState || !this.gameState.settings || this.gameState.settings.advanced_shops !== false) ? `
          <div class="deed-info-row">
            <span>Advanced Shop:</span>
            <span style="font-weight:700;color:${hasShop ? '#059669' : '#64748b'};display:inline-flex;align-items:center;gap:6px;">
              ${hasShop ? '<img src="/img/shop.svg" class="shop-deed-icon" alt="" /> Built (+60% mortgage value)' : 'None'}
            </span>
          </div>
        ` : ''}
        <div class="deed-info-row"><span>Status:</span><span style="${isMortgaged ? 'color:#ef4444;font-weight:800;' : ''}">${isMortgaged ? 'MORTGAGED ($0 Rent)' : (state && state.owner ? 'Active' : 'Unowned')}</span></div>
        <div class="deed-info-row"><span>Owner:</span><span style="color:${owner ? owner.color : '#666'}">${owner ? `${owner.name}${owner.in_jail ? ' ⛓️ (In Prison)' : ''}` : 'Unowned'}</span></div>

        <!-- Room Rules Status Pill -->
        <div style="margin-top:10px;padding:8px;background:#f8fafc;border-radius:6px;font-size:0.72rem;color:#475569;line-height:1.35;">
          • <strong>x2 Rent Rule:</strong> ${this.gameState && this.gameState.settings && this.gameState.settings.double_rent_full_set ? 'Enabled (2x base rent on full unimproved set)' : 'Disabled'}<br>
          • <strong>Prison Rule:</strong> ${this.gameState && this.gameState.settings && this.gameState.settings.no_rent_in_prison ? 'No rent collected while owner is in prison' : 'Rent collected normally'}<br>
          • <strong>Even Build Rule:</strong> ${this.gameState && this.gameState.settings && this.gameState.settings.even_build ? 'Enabled (must build/sell evenly across set)' : 'Disabled'}<br>
          • <strong>Advanced Shops:</strong> ${this.gameState && this.gameState.settings && this.gameState.settings.advanced_shops ? 'Enabled (shops boost mortgage value, safe to mortgage)' : 'Disabled'}
        </div>

        ${isMine && !this.isSpectator ? `
          <div class="deed-controls">
            ${tile.type === 'property' && state.houses < 5 && !state.mortgaged ? `
              <button class="btn-primary" style="padding:8px;font-size:0.85rem;" onclick="game.buildHouse(${tileId})">
                ${state.houses === 4 ? `🏨 Build Hotel ($${tile.house_cost})` : `🏠 Build House ($${tile.house_cost})`}
              </button>
            ` : ''}
            ${tile.type === 'property' && state.houses > 0 ? `
              <button class="btn-secondary" style="padding:8px;font-size:0.85rem;" onclick="game.sellHouse(${tileId})">
                ${state.houses === 5 ? `🔨 Sell Hotel (+$${Math.floor(tile.house_cost / 2)})` : `🔨 Sell House (+$${Math.floor(tile.house_cost / 2)})`}
              </button>
            ` : ''}
            ${tile.type === 'property' && (!this.gameState || !this.gameState.settings || this.gameState.settings.advanced_shops !== false) ? `
              ${!hasShop ? `
                <button class="btn-primary" style="padding:8px;font-size:0.85rem;background:#059669;display:inline-flex;align-items:center;justify-content:center;gap:6px;" onclick="game.buildShop(${tileId})"><img src="/img/shop.svg" class="shop-btn-icon" alt="" /> Build Shop ($${tile.house_cost})</button>
              ` : `
                <button class="btn-secondary" style="padding:8px;font-size:0.85rem;color:#f59e0b;display:inline-flex;align-items:center;justify-content:center;gap:6px;" onclick="game.sellShop(${tileId})"><img src="/img/shop.svg" class="shop-btn-icon" style="filter:none;" alt="" /> Sell Shop (+$${Math.floor(tile.house_cost / 2)})</button>
              `}
            ` : ''}
            ${!state.mortgaged && state.houses === 0 && (this.gameState.settings ? this.gameState.settings.mortgage_enabled : true) ? `
              <button class="btn-secondary" style="padding:8px;font-size:0.85rem;color:#f87171;" onclick="game.mortgageProperty(${tileId})">Mortgage (+$${mortgageValue})</button>
            ` : ''}
            ${state.mortgaged ? `
              <button class="btn-primary" style="padding:8px;font-size:0.85rem;" onclick="game.unmortgageProperty(${tileId})">Unmortgage (-$${Math.round(mortgageValue * 1.1)})</button>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;

    this.openModal('modal-deed');
  }

  buildShop(tileId) {
    const tid = parseInt(tileId, 10);
    const tile = this.boardData && this.boardData.tiles ? this.boardData.tiles[tid] : null;
    const myPlayer = this.gameState && this.gameState.players ? this.gameState.players.find(p => p.id === this.playerId) : null;
    const tileState = this.gameState && this.gameState.tile_states ? this.gameState.tile_states[tid] : null;

    if (tile && myPlayer && tileState) {
      if (tileState.owner !== this.playerId) {
        this.showActionReasonPopup('Cannot Build Shop', 'You do not own this property.');
        return;
      }
      if (tile.type !== 'property') {
        this.showActionReasonPopup('Cannot Build Shop', 'Advanced shops can only be built on street color properties.');
        return;
      }
      if (tileState.shops >= 1) {
        this.showActionReasonPopup('Shop Already Built', 'This property already has an Advanced Shop.');
        return;
      }
      const cost = tile.house_cost || 100;
      if (myPlayer.cash < cost) {
        this.showActionReasonPopup('Insufficient Cash', `Building an Advanced Shop costs $${cost}, but your balance is only $${myPlayer.cash}.`);
        return;
      }
    }

    this.sendAction({ action: 'BUILD_SHOP', tileId: tileId });
    window.soundEngine.buildHouse();
    this.closeAllModals();
  }

  sellShop(tileId) {
    this.sendAction({ action: 'SELL_SHOP', tileId: tileId });
    window.soundEngine.sellHouse();
    this.closeAllModals();
  }

  buildHouse(tileId) {
    const tid = parseInt(tileId, 10);
    const tile = this.boardData && this.boardData.tiles ? this.boardData.tiles[tid] : null;
    const myPlayer = this.gameState && this.gameState.players ? this.gameState.players.find(p => p.id === this.playerId) : null;
    const tileState = this.gameState && this.gameState.tile_states ? this.gameState.tile_states[tid] : null;

    if (tile && myPlayer && tileState) {
      const isHotel = tileState.houses === 4;
      const buildName = isHotel ? 'Hotel' : 'House';
      if (this.gameState && this.gameState.current_player_id !== this.playerId) {
        this.showActionReasonPopup(`Cannot Build ${buildName}`, 'Houses and hotels can only be built during your own turn.');
        return;
      }
      if (tileState.owner !== this.playerId) {
        this.showActionReasonPopup(`Cannot Build ${buildName}`, 'You do not own this property.');
        return;
      }
      if (tile.type !== 'property') {
        this.showActionReasonPopup(`Cannot Build ${buildName}`, 'Houses and hotels can only be built on street properties in color groups.');
        return;
      }
      const groupKey = tile.group;
      const groupTiles = this.boardData.color_groups[groupKey] ? this.boardData.color_groups[groupKey].tiles : [];
      const ownsAll = groupTiles.every(tId => this.gameState.tile_states[tId] && this.gameState.tile_states[tId].owner === this.playerId);
      if (!ownsAll) {
        const gName = this.boardData.color_groups[groupKey] ? this.boardData.color_groups[groupKey].name : 'this';
        this.showActionReasonPopup('Monopoly Required', `You must own all properties in the ${gName} color group before you can build ${isHotel ? 'a hotel' : 'houses'}.`);
        return;
      }
      const hasMortgaged = groupTiles.some(tId => this.gameState.tile_states[tId] && this.gameState.tile_states[tId].mortgaged);
      if (hasMortgaged) {
        this.showActionReasonPopup('Mortgaged Property', `You cannot build ${isHotel ? 'a hotel' : 'houses'} while any property in this color group is mortgaged. Unmortgage it first.`);
        return;
      }
      if (tileState.houses >= 5) {
        this.showActionReasonPopup('Maximum Development', 'This property already has a hotel (maximum development level).');
        return;
      }
      const evenBuild = !this.gameState.settings || this.gameState.settings.even_build !== false;
      if (evenBuild) {
        const minHouses = Math.min(...groupTiles.map(tId => this.gameState.tile_states[tId] ? this.gameState.tile_states[tId].houses : 0));
        if (tileState.houses > minHouses) {
          const lagPropId = groupTiles.find(tId => this.gameState.tile_states[tId] && this.gameState.tile_states[tId].houses === minHouses);
          const lagName = (this.boardData.tiles[lagPropId] ? this.boardData.tiles[lagPropId].name : 'another site');
          this.showActionReasonPopup(
            'Uneven Building Not Allowed',
            `Richup rules require building houses evenly! You must build a house on ${lagName} (${minHouses} houses) before adding more on ${tile.name} (${tileState.houses} houses).`
          );
          return;
        }
      }
      if (myPlayer.cash < tile.house_cost) {
        this.showActionReasonPopup('Insufficient Cash', `Building a ${buildName.toLowerCase()} on ${tile.name} costs $${tile.house_cost}, but your balance is only $${myPlayer.cash}.`);
        return;
      }
    }

    this.sendAction({ action: 'BUILD_HOUSE', tileId: tileId });
    window.soundEngine.buildHouse();
    this.closeAllModals();
  }

  sellHouse(tileId) {
    const tid = parseInt(tileId, 10);
    const tile = this.boardData && this.boardData.tiles ? this.boardData.tiles[tid] : null;
    const tileState = this.gameState && this.gameState.tile_states ? this.gameState.tile_states[tid] : null;

    if (tile && tileState) {
      if (tileState.owner !== this.playerId) {
        this.showActionReasonPopup('Cannot Sell House', 'You do not own this property.');
        return;
      }
      if (tileState.houses <= 0) {
        this.showActionReasonPopup('Cannot Sell House', 'This property has no houses to sell.');
        return;
      }
      const groupKey = tile.group;
      const groupTiles = this.boardData.color_groups[groupKey] ? this.boardData.color_groups[groupKey].tiles : [];
      const evenBuild = !this.gameState.settings || this.gameState.settings.even_build !== false;
      if (evenBuild) {
        const maxHouses = Math.max(...groupTiles.map(tId => this.gameState.tile_states[tId] ? this.gameState.tile_states[tId].houses : 0));
        if (tileState.houses < maxHouses) {
          const aheadPropId = groupTiles.find(tId => this.gameState.tile_states[tId] && this.gameState.tile_states[tId].houses === maxHouses);
          const aheadName = (this.boardData.tiles[aheadPropId] ? this.boardData.tiles[aheadPropId].name : 'another site');
          this.showActionReasonPopup(
            'Uneven Selling Not Allowed',
            `Richup rules require selling houses evenly! You must sell a house from ${aheadName} (${maxHouses} houses) before selling from ${tile.name} (${tileState.houses} houses).`
          );
          return;
        }
      }
    }

    this.sendAction({ action: 'SELL_HOUSE', tileId: tileId });
    this.closeAllModals();
  }

  mortgageProperty(tileId) {
    const tid = parseInt(tileId, 10);
    const tile = this.boardData && this.boardData.tiles ? this.boardData.tiles[tid] : null;
    const tileState = this.gameState && this.gameState.tile_states ? this.gameState.tile_states[tid] : null;

    if (tile && tileState) {
      if (tileState.owner !== this.playerId) {
        this.showActionReasonPopup('Cannot Mortgage', 'You do not own this property.');
        return;
      }
      if (tileState.mortgaged) {
        this.showActionReasonPopup('Already Mortgaged', 'This property is already mortgaged.');
        return;
      }
      if (tile.type === 'property' && tile.group && this.boardData.color_groups[tile.group]) {
        const groupTiles = this.boardData.color_groups[tile.group].tiles;
        const hasHouses = groupTiles.some(tId => this.gameState.tile_states[tId] && this.gameState.tile_states[tId].houses > 0);
        if (hasHouses) {
          this.showActionReasonPopup(
            'Houses on Color Group',
            'You cannot mortgage this property while there are houses or hotels built on any property in this color group. Sell all houses in this group first.'
          );
          return;
        }
      }
    }

    this.sendAction({ action: 'MORTGAGE', tileId: tileId });
    this.closeAllModals();
  }

  unmortgageProperty(tileId) {
    const tid = parseInt(tileId, 10);
    const tile = this.boardData && this.boardData.tiles ? this.boardData.tiles[tid] : null;
    const myPlayer = this.gameState && this.gameState.players ? this.gameState.players.find(p => p.id === this.playerId) : null;
    const tileState = this.gameState && this.gameState.tile_states ? this.gameState.tile_states[tid] : null;

    if (tile && myPlayer && tileState) {
      if (!tileState.mortgaged) {
        this.showActionReasonPopup('Not Mortgaged', 'This property is not currently mortgaged.');
        return;
      }
      const cost = Math.round(tile.mortgage * 1.1);
      if (myPlayer.cash < cost) {
        this.showActionReasonPopup('Insufficient Cash', `Unmortgaging ${tile.name} costs $${cost} (mortgage value + 10% interest), but your balance is only $${myPlayer.cash}.`);
        return;
      }
    }

    this.sendAction({ action: 'UNMORTGAGE', tileId: tileId });
    this.closeAllModals();
  }

  // ================= Auction Engine =================
  renderAuction() {
    const banner = document.getElementById('modal-auction');
    if (!this.gameState || !this.gameState.auction) {
      this.heldAuctionTileId = null;
      this.closeModal('modal-auction');
      return;
    }

    const auc = this.gameState.auction;
    // If the auction has changed to a new property, reset held status
    if (this.heldAuctionTileId && this.heldAuctionTileId !== auc.tile_id) {
      this.heldAuctionTileId = null;
    }

    // If user clicked close/cross on the auction popup, keep it closed (interact from sidebar)
    if (this.heldAuctionTileId === auc.tile_id) {
      this.closeModal('modal-auction');
      return;
    }
    const tile = this.boardData.tiles[auc.tile_id];
    const leader = auc.highest_bidder ? this.gameState.players.find(p => p.id === auc.highest_bidder) : null;
    const myPlayer = this.gameState.players.find(p => p.id === this.playerId);
    const hasPassed = auc.passed && auc.passed.includes(this.playerId);
    const flagSvg = getCircularFlagSvg(tile.country_code);

    const content = document.getElementById('auction-modal-content');
    if (!content) return;

    let timerHtml = '';
    if (auc.deadline) {
      const now = Date.now() / 1000;
      const timeLeft = Math.max(0, Math.ceil(auc.deadline - now));
      const isUrgent = timeLeft <= 2 && timeLeft > 0;
      timerHtml = `
        <div class="timer-box auction-timer-display ${isUrgent ? 'urgent' : ''}" id="auction-timer-pill" style="align-self:center;font-size:1.15rem;padding:6px 18px;background:rgba(245,158,11,0.18);border:1px solid #f59e0b;color:#fbbf24;">
          ⏱️ Ending in <strong>${timeLeft}s</strong>
        </div>
      `;
    } else {
      timerHtml = `
        <div class="timer-box auction-timer-display" id="auction-timer-pill" style="align-self:center;font-size:0.95rem;padding:6px 16px;background:rgba(255,255,255,0.06);color:var(--text-muted);">
          ⚖️ Place your bet (15s to place bid)
        </div>
      `;
    }

    content.innerHTML = `
      <div class="auction-box">
        <div style="display:flex;align-items:center;justify-content:center;gap:12px;">
          <div class="richup-flag-circle" style="width:36px;height:36px;min-width:36px;min-height:36px;">${flagSvg}</div>
          <div>
            <div style="font-size:1.3rem;font-weight:800;color:#fff;">AUCTION: ${tile.name}</div>
            <div style="font-size:0.85rem;color:var(--text-muted);">${tile.country || ''} • Original Price: $${tile.price}</div>
          </div>
        </div>
        <div style="font-size:2.2rem;font-weight:900;color:#fbbf24;">$${auc.highest_bid}</div>
        <div style="font-size:0.95rem;color:#e2e8f0;">Leading Bidder: <strong>${leader ? leader.name : 'No bids yet'}</strong></div>
        ${timerHtml}

        ${!hasPassed && myPlayer && !myPlayer.is_bankrupt && !this.isSpectator ? `
          <div class="auction-bid-btn-group">
            <button class="bid-quick-btn" onclick="game.placeBid(${auc.highest_bid + 10})">+$10</button>
            <button class="bid-quick-btn" onclick="game.placeBid(${auc.highest_bid + 50})">+$50</button>
            <button class="bid-quick-btn" onclick="game.placeBid(${auc.highest_bid + 100})">+$100</button>
          </div>
          <button class="btn-secondary" style="border-color:#ef4444;color:#ef4444;" onclick="game.passBid()">Pass (Withdraw)</button>
        ` : `
          <div style="color:var(--text-dim);font-weight:600;">${this.isSpectator ? 'Spectating auction.' : 'You have passed on this auction.'}</div>
        `}
      </div>
    `;

    this.openModal('modal-auction');
  }

  placeBid(amount) {
    this.sendAction({ action: 'AUCTION_BID', amount: amount });
    window.soundEngine.auctionGavel();
    const aucTimer = document.getElementById('auction-timer-pill');
    if (aucTimer) {
      aucTimer.innerHTML = `⏱️ Ending in <strong>3s</strong>`;
      aucTimer.classList.add('urgent');
    }
  }

  passBid() {
    this.sendAction({ action: 'AUCTION_PASS' });
  }

  // ================= Trade Desk =================
  openTradeDesk(targetPlayerId, negotiateTrade = null) {
    if (this.isSpectator) return;
    this.activeTradePartnerId = targetPlayerId;
    this.negotiatingTradeId = negotiateTrade ? negotiateTrade.id : null;
    this.tradeOfferProperties.clear();
    this.tradeRequestProperties.clear();

    const targetPlayer = this.gameState.players.find(p => p.id === targetPlayerId);
    const myPlayer = this.gameState.players.find(p => p.id === this.playerId);
    if (!targetPlayer || !myPlayer) return;

    const titleEl = document.getElementById('trade-desk-modal-title');
    const submitBtn = document.getElementById('btn-submit-trade-offer');

    if (negotiateTrade) {
      if (titleEl) titleEl.innerHTML = `⚖️ Negotiate Deal with <span id="trade-partner-name" style="color:#38bdf8;">${targetPlayer.name}</span>`;
      if (submitBtn) submitBtn.innerHTML = 'Send Counter-Offer 🤝';
    } else {
      if (titleEl) titleEl.innerHTML = `🤝 Trade Desk: Deal with <span id="trade-partner-name" style="color:#38bdf8;">${targetPlayer.name}</span>`;
      if (submitBtn) submitBtn.innerHTML = 'Send Proposal';
    }

    // Debt liquidation notification banner
    const debtBanner = document.getElementById('trade-desk-debt-banner');
    if (debtBanner) {
      if (myPlayer.cash < 0) {
        debtBanner.style.display = 'block';
        debtBanner.innerHTML = `⚠️ <strong>Debt Liquidation Mode:</strong> You are currently in debt (<strong>-$${Math.abs(myPlayer.cash)}</strong>). You cannot offer cash, but you can sell/trade your properties to <strong>${targetPlayer.name}</strong> for cash to pay off your debt and stay in the game!`;
      } else {
        debtBanner.style.display = 'none';
        debtBanner.innerHTML = '';
      }
    }

    // Set up my cash slider: min 0, max my bank balance
    const myCashSlider = document.getElementById('trade-my-cash');
    const myCashDisplay = document.getElementById('trade-my-cash-display');
    const myCashMinLbl = document.getElementById('trade-my-cash-min-lbl');
    const myCashMaxLbl = document.getElementById('trade-my-cash-max-lbl');

    const myMax = Math.max(0, myPlayer.cash);
    const myInitialVal = (negotiateTrade && negotiateTrade.request && typeof negotiateTrade.request.cash === 'number')
      ? Math.min(negotiateTrade.request.cash, myMax)
      : 0;

    if (myCashSlider) {
      myCashSlider.min = 0;
      myCashSlider.max = myMax;
      myCashSlider.value = myInitialVal;
      myCashSlider.disabled = (myMax === 0);
      if (myCashMinLbl) myCashMinLbl.innerText = '$0';
      if (myCashMaxLbl) myCashMaxLbl.innerText = `$${myMax}`;
      if (myCashDisplay) {
        myCashDisplay.innerText = myPlayer.cash < 0 ? `$0 (In Debt: -$${Math.abs(myPlayer.cash)})` : `$${myInitialVal}`;
      }
    }

    // Set up their cash slider:
    // Rule: for negotiated trade, slider minimum value is the previous trade the person offered, while max is their bank balance
    const theirCashSlider = document.getElementById('trade-their-cash');
    const theirCashDisplay = document.getElementById('trade-their-cash-display');
    const theirCashMinLbl = document.getElementById('trade-their-cash-min-lbl');
    const theirCashMaxLbl = document.getElementById('trade-their-cash-max-lbl');

    let theirMin = 0;
    let theirInitialVal = 0;
    const theirMax = Math.max(0, targetPlayer.cash);

    if (negotiateTrade && negotiateTrade.offer && typeof negotiateTrade.offer.cash === 'number') {
      theirMin = Math.min(negotiateTrade.offer.cash, theirMax);
      theirInitialVal = theirMin;
    }

    if (theirCashSlider) {
      theirCashSlider.min = theirMin;
      theirCashSlider.max = Math.max(theirMin, theirMax);
      theirCashSlider.value = theirInitialVal;
      theirCashSlider.disabled = (theirMax === 0);
      if (theirCashMinLbl) theirCashMinLbl.innerText = `$${theirMin}`;
      if (theirCashMaxLbl) theirCashMaxLbl.innerText = `$${theirMax}`;
      if (theirCashDisplay) {
        theirCashDisplay.innerText = targetPlayer.cash <= 0 ? `$0 (${targetPlayer.name} has no cash)` : `$${theirInitialVal}`;
      }
    }

    // Pre-populate properties if negotiating
    if (negotiateTrade) {
      if (negotiateTrade.request && Array.isArray(negotiateTrade.request.properties)) {
        negotiateTrade.request.properties.forEach(tid => {
          const numId = parseInt(tid, 10);
          if (myPlayer.properties.includes(numId)) {
            this.tradeOfferProperties.add(numId);
          }
        });
      }
      if (negotiateTrade.offer && Array.isArray(negotiateTrade.offer.properties)) {
        negotiateTrade.offer.properties.forEach(tid => {
          const numId = parseInt(tid, 10);
          if (targetPlayer.properties.includes(numId)) {
            this.tradeRequestProperties.add(numId);
          }
        });
      }
    }

    // Render my tradeable properties with circular flag
    const myPropsEl = document.getElementById('trade-my-properties');
    myPropsEl.innerHTML = myPlayer.properties.map(tid => {
      const t = this.boardData.tiles[tid];
      const gColor = t.group && this.boardData.color_groups[t.group] ? this.boardData.color_groups[t.group].color : '#888';
      const flagSvg = getCircularFlagSvg(t.country_code);
      const isSelected = this.tradeOfferProperties.has(tid);
      return `
        <div class="trade-prop-item ${isSelected ? 'selected' : ''}" id="trade-my-prop-${tid}" onclick="game.toggleTradeProperty('offer', ${tid})">
          <div class="trade-prop-pill" style="background:${gColor}"></div>
          <div class="richup-flag-circle" style="width:20px;height:20px;min-width:20px;min-height:20px;">${flagSvg}</div>
          <span>${t.name} (${t.country || ''})</span>
        </div>
      `;
    }).join('') || '<div style="color:var(--text-dim);font-size:0.8rem;">No properties owned</div>';

    // Render their tradeable properties with circular flag
    const theirPropsEl = document.getElementById('trade-their-properties');
    theirPropsEl.innerHTML = targetPlayer.properties.map(tid => {
      const t = this.boardData.tiles[tid];
      const gColor = t.group && this.boardData.color_groups[t.group] ? this.boardData.color_groups[t.group].color : '#888';
      const flagSvg = getCircularFlagSvg(t.country_code);
      const isSelected = this.tradeRequestProperties.has(tid);
      return `
        <div class="trade-prop-item ${isSelected ? 'selected' : ''}" id="trade-their-prop-${tid}" onclick="game.toggleTradeProperty('request', ${tid})">
          <div class="trade-prop-pill" style="background:${gColor}"></div>
          <div class="richup-flag-circle" style="width:20px;height:20px;min-width:20px;min-height:20px;">${flagSvg}</div>
          <span>${t.name} (${t.country || ''})</span>
        </div>
      `;
    }).join('') || '<div style="color:var(--text-dim);font-size:0.8rem;">No properties owned</div>';

    this.openModal('modal-trade');
  }

  toggleTradeProperty(type, tileId) {
    const numId = parseInt(tileId, 10);
    const set = type === 'offer' ? this.tradeOfferProperties : this.tradeRequestProperties;
    const elId = type === 'offer' ? `trade-my-prop-${numId}` : `trade-their-prop-${numId}`;
    const el = document.getElementById(elId);

    if (set.has(numId)) {
      set.delete(numId);
      if (el) el.classList.remove('selected');
    } else {
      set.add(numId);
      if (el) el.classList.add('selected');
    }
  }

  sendTradeOffer() {
    const offerCashInput = document.getElementById('trade-my-cash');
    const requestCashInput = document.getElementById('trade-their-cash');
    const offerCash = Math.max(0, parseInt(offerCashInput ? offerCashInput.value : 0, 10) || 0);
    const requestCash = Math.max(0, parseInt(requestCashInput ? requestCashInput.value : 0, 10) || 0);

    const offerProps = Array.from(this.tradeOfferProperties);
    const reqProps = Array.from(this.tradeRequestProperties);

    if (offerProps.length === 0 && reqProps.length === 0 && offerCash === 0 && requestCash === 0) {
      this.showToast('Please select at least one property or enter cash to propose a trade.');
      return;
    }

    if (this.negotiatingTradeId) {
      this.sendAction({
        action: 'NEGOTIATE_TRADE',
        tradeId: this.negotiatingTradeId,
        offer: {
          cash: offerCash,
          properties: offerProps
        },
        request: {
          cash: requestCash,
          properties: reqProps
        }
      });
      this.negotiatingTradeId = null;
      this.closeAllModals();
      this.showToast('Negotiated counter-offer sent! 🤝');
    } else {
      this.sendAction({
        action: 'PROPOSE_TRADE',
        receiverId: this.activeTradePartnerId,
        offer: {
          cash: offerCash,
          properties: offerProps
        },
        request: {
          cash: requestCash,
          properties: reqProps
        }
      });
      this.closeAllModals();
      this.showToast('Trade offer sent! 🤝');
    }
  }

  checkIncomingTrades() {
    if (!this.gameState || !this.gameState.active_trades || this.isSpectator) return;
    const incoming = this.gameState.active_trades.find(t => t.receiver_id === this.playerId && t.status === 'PENDING');
    const modal = document.getElementById('modal-incoming-trade');
    if (!incoming) {
      if (modal) modal.classList.remove('active');
      this.currentIncomingTradeId = null;
      return;
    }

    this.currentIncomingTradeId = incoming.id;

    // If user clicked cross (✕) to hold this trade popup, keep it closed so they interact from sidebar Trades menu
    if (this.heldIncomingTradeIds && this.heldIncomingTradeIds.has(incoming.id)) {
      return;
    }

    const content = document.getElementById('incoming-trade-content');
    if (content) {
      const offerProps = incoming.offer.properties.map(tid => {
        const t = this.boardData.tiles[tid];
        return `${t.name} (${t.country || ''})`;
      }).join(', ') || 'None';

      const reqProps = incoming.request.properties.map(tid => {
        const t = this.boardData.tiles[tid];
        return `${t.name} (${t.country || ''})`;
      }).join(', ') || 'None';

      content.innerHTML = `
        <div style="font-size:1.1rem;font-weight:700;margin-bottom:12px;">Trade Offer from ${incoming.sender_name}</div>
        <div style="background:var(--bg-surface);padding:12px;border-radius:8px;margin-bottom:12px;">
          <div style="color:#34d399;font-weight:700;">They Offer You:</div>
          <div>Cash: $${incoming.offer.cash}</div>
          <div>Properties: ${offerProps}</div>
        </div>
        <div style="background:var(--bg-surface);padding:12px;border-radius:8px;margin-bottom:16px;">
          <div style="color:#f87171;font-weight:700;">They Want From You:</div>
          <div>Cash: $${incoming.request.cash}</div>
          <div>Properties: ${reqProps}</div>
        </div>
        <div style="display:flex;gap:10px;">
          <button class="btn-primary" style="flex:1;" onclick="game.respondTrade('${incoming.id}', true)">Accept Deal</button>
          <button class="btn-primary" style="flex:1;background:linear-gradient(135deg, #0ea5e9, #0284c7);border-color:#0284c7;" onclick="game.startTradeNegotiation('${incoming.id}')">Negotiate ⚖️</button>
          <button class="btn-secondary" style="flex:1;color:#ef4444;" onclick="game.respondTrade('${incoming.id}', false)">Decline</button>
        </div>
      `;
      this.openModal('modal-incoming-trade');
    }
  }

  holdIncomingTrade() {
    if (this.currentIncomingTradeId) {
      this.heldIncomingTradeIds.add(this.currentIncomingTradeId);
    }
    this.closeModal('modal-incoming-trade');
    this.showToast('Trade offer on hold. You can review it anytime from the Trades tab in the sidebar 🤝');
  }

  holdAuction() {
    if (this.gameState && this.gameState.auction) {
      this.heldAuctionTileId = this.gameState.auction.tile_id;
    }
    this.closeModal('modal-auction');
    this.showToast('Auction minimized. You can bid or spectate from the Auctions tab in the sidebar ⚖️');
  }

  startTradeNegotiation(tradeId) {
    if (!this.gameState) return;
    let trade = null;
    if (this.gameState.active_trades) {
      trade = this.gameState.active_trades.find(t => t.id === tradeId);
    }
    if (!trade && this.gameState.trade_history) {
      trade = this.gameState.trade_history.find(t => t.id === tradeId);
    }
    if (!trade) {
      this.showToast('Trade offer not found');
      return;
    }

    this.closeModal('modal-incoming-trade');
    this.closeModal('modal-trade-detail');
    this.openTradeDesk(trade.sender_id, trade);
  }

  respondTrade(tradeId, accept) {
    this.sendAction({
      action: 'RESPOND_TRADE',
      tradeId: tradeId,
      accept: accept
    });
    this.closeAllModals();
  }

  cancelTrade(tradeId) {
    this.sendAction({
      action: 'CANCEL_TRADE',
      tradeId: tradeId
    });
    this.closeModal('modal-trade-detail');
    this.closeModal('modal-incoming-trade');
    this.showToast('Trade cancelled / declined');
  }

  // ================= Quick Reaction System (With Anti-Spam Cooldown) =================
  sendQuickReaction(emoji) {
    if (!emoji) return;
    const now = Date.now();
    this.reactionBurstHistory = (this.reactionBurstHistory || []).filter(t => now - t < 3000);

    if (this.reactionBurstHistory.length >= 3 || (now - (this.lastReactionTime || 0) < 800)) {
      this.showToast('⏳ Reaction cooldown! Please avoid spamming.', 'warning');
      this.applyReactionCooldownVisuals(1000);
      return;
    }

    this.reactionBurstHistory.push(now);
    this.lastReactionTime = now;
    this.applyReactionCooldownVisuals(800);

    this.sendAction({
      action: 'SEND_REACTION',
      emoji: emoji
    });
  }

  applyReactionCooldownVisuals(durationMs = 800) {
    const btns = document.querySelectorAll('.reaction-btn');
    btns.forEach(b => b.classList.add('cooldown'));
    setTimeout(() => {
      btns.forEach(b => b.classList.remove('cooldown'));
    }, durationMs);
  }

  // ================= Live Chat System (With Anti-Spam Rate Limiting) =================
  sendChatMessage(context = 'game') {
    const inputId = context === 'lobby' ? 'lobby-chat-input' : 'chat-input';
    const input = document.getElementById(inputId);
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    const now = Date.now();
    this.chatBurstHistory = (this.chatBurstHistory || []).filter(t => now - t < 5000);

    // 1. Curb duplicate message spam within 5 seconds
    if (text === this.lastChatText && (now - (this.lastChatTime || 0) < 5000)) {
      this.showToast('⚠️ Please do not repeat the exact same message.', 'warning');
      return;
    }

    // 2. Curb rapid message rate (max 1 per 1.0s or max 3 per 5s)
    if (this.chatBurstHistory.length >= 3 || (now - (this.lastChatTime || 0) < 1000)) {
      this.showToast('⏳ Chat cooldown! Please wait a moment.', 'warning');
      input.disabled = true;
      const originalPlaceholder = input.placeholder;
      input.placeholder = '⏳ Chat cooldown active...';
      setTimeout(() => {
        input.disabled = false;
        input.placeholder = originalPlaceholder;
        input.focus();
      }, 1500);
      return;
    }

    this.chatBurstHistory.push(now);
    this.lastChatTime = now;
    this.lastChatText = text;

    this.sendAction({
      action: 'SEND_CHAT',
      text: text.substring(0, 200)
    });

    input.value = '';
    input.focus();
  }

  renderChatMessages() {
    if (!this.gameState) return;
    const messages = this.gameState.chat_messages || [];

    // Play notification sound when a new chat message arrives
    if (this.previousChatCount !== undefined && messages.length > this.previousChatCount) {
      if (window.soundEngine && typeof window.soundEngine.chatMessage === 'function') {
        window.soundEngine.chatMessage();
      }
    }

    // Check for unread indicator when not currently viewing the chat tab in-game
    if (messages.length > (this.lastSeenChatCount || 0)) {
      if (this.activeSidebarTab !== 'chat') {
        const dot = document.getElementById('chat-unread-dot');
        if (dot) dot.style.display = 'inline-block';
      } else {
        this.lastSeenChatCount = messages.length;
      }
    }

    const formatMessageHtml = (msg) => {
      const isMine = msg.player_id === this.playerId;
      const timeStr = msg.time ? new Date(msg.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
      const safeText = document.createElement('div');
      safeText.innerText = msg.text;
      const textHtml = safeText.innerHTML;

      return `
        <div class="chat-msg-row ${isMine ? 'mine' : 'theirs'}">
          <div class="chat-msg-meta">
            <span>${msg.avatar || '👤'}</span>
            <span class="chat-msg-name" style="color:${msg.color || '#38bdf8'};">${msg.sender_name}</span>
            <span class="chat-msg-time">${timeStr}</span>
          </div>
          <div class="chat-msg-bubble">
            ${textHtml}
          </div>
        </div>
      `;
    };

    const allHtml = messages.length > 0
      ? messages.map(formatMessageHtml).join('')
      : '<div style="color:var(--text-dim);font-size:0.8rem;text-align:center;padding:24px 0;">No messages yet. Say hello! 👋</div>';

    // 1. Sidebar in-game stream
    const sidebarStream = document.getElementById('chat-messages-stream');
    if (sidebarStream) {
      const isAtBottom = sidebarStream.scrollHeight - sidebarStream.scrollTop <= sidebarStream.clientHeight + 80;
      sidebarStream.innerHTML = allHtml;
      if (isAtBottom || messages.length !== this.previousChatCount) {
        sidebarStream.scrollTop = sidebarStream.scrollHeight;
      }
    }

    // 2. Lobby stream
    const lobbyStream = document.getElementById('lobby-chat-messages');
    if (lobbyStream) {
      const isAtBottom = lobbyStream.scrollHeight - lobbyStream.scrollTop <= lobbyStream.clientHeight + 80;
      lobbyStream.innerHTML = allHtml;
      if (isAtBottom || messages.length !== this.previousChatCount) {
        lobbyStream.scrollTop = lobbyStream.scrollHeight;
      }
    }

    this.previousChatCount = messages.length;
  }

  // ================= Trades Tab & Trade History =================
  renderTradesTab() {
    const container = document.getElementById('sidebar-trades-content');
    if (!container || !this.gameState) return;

    const activeTrades = this.gameState.active_trades || [];
    const tradeHistory = this.gameState.trade_history || [];

    let html = '';

    // 1. Active Trades Section
    html += `<div class="trade-section-header"><span>⚡ Active Trades (${activeTrades.length})</span></div>`;
    if (activeTrades.length > 0) {
      html += activeTrades.map(trade => {
        const isReceiver = trade.receiver_id === this.playerId;
        const isSender = trade.sender_id === this.playerId;
        const isParticipant = isReceiver || isSender;

        return `
          <div class="trade-list-item active-deal" onclick="game.openTradeDetailModal('${trade.id}', false)">
            <div class="trade-item-header">
              <span class="trade-status-badge pending">Active Deal</span>
              <span class="trade-action-pill ${isParticipant ? 'interact' : 'spectate'}">
                ${isParticipant ? '🤝 Open Deal' : '👁️ Spectate'}
              </span>
            </div>
            <div class="trade-item-text">
              <strong>${trade.sender_name}</strong> Offered a Trade to <strong>${trade.receiver_name}</strong>
            </div>
            <div class="trade-item-hint">Click to ${isParticipant ? 'interact with' : 'spectate'} this trade deal</div>
          </div>
        `;
      }).join('');
    } else {
      html += `<div class="trade-empty-state">No pending trades right now.</div>`;
    }

    // 2. Trade History Section
    html += `<div class="trade-section-header" style="margin-top:16px;"><span>📜 Trade History (${tradeHistory.length})</span></div>`;
    if (tradeHistory.length > 0) {
      html += tradeHistory.slice().reverse().map(trade => {
        const isAccepted = trade.status === 'ACCEPTED';
        const isCountered = trade.status === 'COUNTERED';
        const badgeClass = isAccepted ? 'accepted' : (isCountered ? 'countered' : 'declined');
        const badgeText = isAccepted ? 'Traded' : (isCountered ? 'Countered' : (trade.status === 'DECLINED' || trade.status === 'REJECTED' ? 'Declined' : 'Cancelled'));

        const titleText = isAccepted
          ? `<strong>${trade.sender_name}</strong> traded with <strong>${trade.receiver_name}</strong>`
          : (isCountered
            ? `<strong>${trade.receiver_name}</strong> countered <strong>${trade.sender_name}</strong>'s offer`
            : `Trade proposal: <strong>${trade.sender_name}</strong> & <strong>${trade.receiver_name}</strong> (${badgeText})`);

        return `
          <div class="trade-list-item" onclick="game.openTradeDetailModal('${trade.id}', true)">
            <div class="trade-item-header">
              <span class="trade-status-badge ${badgeClass}">${badgeText}</span>
              <span style="font-size:0.68rem;color:var(--text-dim);">${trade.resolved_at ? new Date(trade.resolved_at * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
            </div>
            <div class="trade-item-text">
              ${titleText}
            </div>
            <div class="trade-item-hint">Click to see what was ${isAccepted ? 'traded' : 'offered'} 📋</div>
          </div>
        `;
      }).join('');
    } else {
      html += `<div class="trade-empty-state">No completed trades yet.</div>`;
    }

    container.innerHTML = html;
  }

  openTradeDetailModal(tradeId, isHistory = false) {
    if (!this.gameState) return;
    let trade = null;
    if (this.gameState.trade_history) {
      trade = this.gameState.trade_history.find(t => t.id === tradeId);
    }
    if (!trade && this.gameState.active_trades) {
      trade = this.gameState.active_trades.find(t => t.id === tradeId);
    }
    if (!trade) {
      this.showToast('Trade record not found');
      return;
    }

    const titleEl = document.getElementById('trade-detail-title');
    const contentEl = document.getElementById('trade-detail-content');
    if (!contentEl) return;

    const isAccepted = trade.status === 'ACCEPTED';
    const isActive = trade.status === 'PENDING';

    if (titleEl) {
      titleEl.innerText = isActive
        ? `Active Deal: ${trade.sender_name} ➔ ${trade.receiver_name}`
        : (isAccepted ? `Traded: ${trade.sender_name} & ${trade.receiver_name}` : `Trade Record (${trade.status})`);
    }

    const renderPropsList = (propIds) => {
      if (!propIds || propIds.length === 0) return '<span style="color:var(--text-dim);font-size:0.8rem;">No properties</span>';
      return propIds.map(rawTid => {
        const tid = parseInt(rawTid, 10);
        const t = (this.boardData && this.boardData.tiles) ? this.boardData.tiles[tid] : null;
        if (!t) return `<span style="font-size:0.75rem;color:#aaa;">Property #${rawTid}</span>`;
        const gColor = t.group && this.boardData.color_groups && this.boardData.color_groups[t.group] ? this.boardData.color_groups[t.group].color : '#888';
        const flagSvg = (typeof getCircularFlagSvg === 'function' && t.country_code) ? getCircularFlagSvg(t.country_code) : '';
        return `
          <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.06);border:1px solid ${gColor};padding:4px 8px;border-radius:6px;margin:2px;">
            ${flagSvg ? `<div class="richup-flag-circle" style="width:16px;height:16px;min-width:16px;min-height:16px;">${flagSvg}</div>` : ''}
            <span style="font-weight:700;font-size:0.75rem;color:#fff;">${t.name}</span>
          </div>
        `;
      }).join(' ');
    };

    const offerPropsHtml = renderPropsList(trade.offer ? trade.offer.properties : []);
    const reqPropsHtml = renderPropsList(trade.request ? trade.request.properties : []);

    const isReceiver = trade.receiver_id === this.playerId;
    const isSender = trade.sender_id === this.playerId;

    let actionButtonsHtml = '';
    if (isActive && !this.isSpectator) {
      if (isReceiver) {
        actionButtonsHtml = `
          <div style="display:flex;gap:10px;margin-top:16px;">
            <button class="btn-primary" style="flex:1;" onclick="game.respondTrade('${trade.id}', true)">Accept Deal</button>
            <button class="btn-primary" style="flex:1;background:linear-gradient(135deg, #0ea5e9, #0284c7);border-color:#0284c7;" onclick="game.startTradeNegotiation('${trade.id}')">Negotiate ⚖️</button>
            <button class="btn-secondary" style="flex:1;color:#ef4444;" onclick="game.respondTrade('${trade.id}', false)">Decline Deal</button>
          </div>
        `;
      } else if (isSender) {
        actionButtonsHtml = `
          <div style="margin-top:16px;">
            <button class="btn-secondary" style="width:100%;color:#ef4444;border-color:rgba(239,68,68,0.4);" onclick="game.cancelTrade('${trade.id}')">Decline / Cancel Trade</button>
          </div>
        `;
      } else {
        actionButtonsHtml = `
          <div class="spectator-deal-pill" style="margin-top:16px;">
            👁️ Spectating Trade — Only ${trade.sender_name} and ${trade.receiver_name} can interact
          </div>
        `;
      }
    } else {
      actionButtonsHtml = `
        <div class="spectator-deal-pill" style="margin-top:16px;">
          📜 Status: <strong>${trade.status}</strong>
        </div>
      `;
    }

    const senderActionText = isAccepted ? 'Gave' : 'Gives';
    const receiverActionText = isAccepted ? 'Gave' : 'Gives';

    contentEl.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div style="background:rgba(34, 197, 94, 0.08);border:1px solid rgba(34, 197, 94, 0.25);border-radius:10px;padding:12px;">
          <div style="font-weight:800;color:#4ade80;font-size:0.85rem;margin-bottom:6px;">
            ${trade.sender_name} ${senderActionText}:
          </div>
          <div style="font-size:0.95rem;font-weight:700;color:#fff;margin-bottom:6px;">
            💵 Cash: $${trade.offer ? (trade.offer.cash || 0) : 0}
          </div>
          <div>${offerPropsHtml}</div>
        </div>

        <div style="background:rgba(56, 189, 248, 0.08);border:1px solid rgba(56, 189, 248, 0.25);border-radius:10px;padding:12px;">
          <div style="font-weight:800;color:#38bdf8;font-size:0.85rem;margin-bottom:6px;">
            ${trade.receiver_name} ${receiverActionText}:
          </div>
          <div style="font-size:0.95rem;font-weight:700;color:#fff;margin-bottom:6px;">
            💵 Cash: $${trade.request ? (trade.request.cash || 0) : 0}
          </div>
          <div>${reqPropsHtml}</div>
        </div>

        ${actionButtonsHtml}
      </div>
    `;

    this.openModal('modal-trade-detail');
  }

  // ================= Auctions Tab & Auction History =================
  renderAuctionsTab() {
    const container = document.getElementById('sidebar-auctions-content');
    if (!container || !this.gameState) return;

    const auction = this.gameState.auction;
    const auctionHistory = this.gameState.auction_history || [];

    let html = '';

    // 1. Live Auction Section
    html += `<div class="trade-section-header"><span>⚖️ Live Public Auction</span></div>`;
    if (auction && this.gameState.turn_phase === 'AUCTION') {
      const tile = this.boardData.tiles[auction.tile_id];
      const gColor = tile && tile.group && this.boardData.color_groups[tile.group] ? this.boardData.color_groups[tile.group].color : '#888';
      const flagSvg = tile ? getCircularFlagSvg(tile.country_code) : '';
      const highestBidder = auction.highest_bidder ? (this.gameState.players.find(p => p.id === auction.highest_bidder)?.name || 'Someone') : 'No bids yet';
      const myPlayer = this.gameState.players.find(p => p.id === this.playerId);
      const hasPassed = auction.passed && auction.passed.includes(this.playerId);
      const isBankrupt = myPlayer && myPlayer.is_bankrupt;
      const canBid = !this.isSpectator && !isBankrupt && !hasPassed;

      html += `
        <div class="auction-card-live" style="border-left:4px solid ${gColor};">
          <div class="auction-live-title">
            <div style="display:flex;align-items:center;gap:8px;">
              <div class="richup-flag-circle" style="width:24px;height:24px;">${flagSvg}</div>
              <span class="auction-prop-name">${auction.tile_name}</span>
            </div>
            <span class="trade-status-badge pending">LIVE</span>
          </div>
          <div class="auction-bid-stat">
            <div>
              <div style="font-size:0.72rem;color:var(--text-dim);">Highest Bid</div>
              <div style="font-size:1.15rem;font-weight:900;color:#facc15;">$${auction.highest_bid || 0}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:0.72rem;color:var(--text-dim);">Bidder</div>
              <div style="font-size:0.88rem;font-weight:700;color:#fff;">${highestBidder}</div>
            </div>
          </div>
          <div class="auction-timer-display" id="sidebar-auction-timer-pill" style="font-size:0.8rem;padding:4px 10px;margin-top:6px;background:rgba(255,255,255,0.06);border-radius:6px;text-align:center;">
            ${auction.deadline ? `⏱️ Ending in <strong>${Math.max(0, Math.ceil(auction.deadline - (Date.now() / 1000)))}s</strong>` : '⚖️ Place your bet (3s timer starts on first bet)'}
          </div>
          ${canBid ? `
            <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);margin-top:8px;">Quick Bid:</div>
            <div class="auction-quick-bids">
              <button class="btn-primary" onclick="game.placeAuctionBid(${(auction.highest_bid || 0) + 10})">+$10</button>
              <button class="btn-primary" onclick="game.placeAuctionBid(${(auction.highest_bid || 0) + 50})">+$50</button>
              <button class="btn-primary" onclick="game.placeAuctionBid(${(auction.highest_bid || 0) + 100})">+$100</button>
            </div>
            <div style="display:flex;gap:6px;margin-top:8px;">
              <input type="number" id="sidebar-auction-bid-input" placeholder="Custom $" min="${(auction.highest_bid || 0) + 1}" style="flex:1;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);color:#fff;border-radius:6px;padding:6px 8px;font-size:0.85rem;">
              <button class="btn-primary" style="padding:6px 14px;" onclick="game.submitSidebarBid()">Bid</button>
            </div>
            <div style="margin-top:8px;">
              <button class="btn-secondary" style="width:100%;color:#ef4444;" onclick="game.passAuctionBid()">✋ Pass (Withdraw)</button>
            </div>
          ` : `
            <div class="spectator-deal-pill" style="margin-top:8px;">
              ${hasPassed ? 'You passed on this auction' : (this.isSpectator ? 'Spectating live auction' : 'Cannot bid')}
            </div>
          `}
          <div style="margin-top:10px;">
            <button class="btn-secondary" style="width:100%;font-size:0.75rem;" onclick="game.reopenAuctionModal()">🔍 Re-open Auction Window</button>
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="trade-empty-state">
          ⚖️ No active auction right now.<br>
          <span style="font-size:0.74rem;color:var(--text-dim);">When a player declines to buy a property, an auction will appear here.</span>
        </div>
      `;
    }

    // 2. Auction History Section
    html += `<div class="trade-section-header" style="margin-top:16px;"><span>📜 Auction Results History (${auctionHistory.length})</span></div>`;
    if (auctionHistory.length > 0) {
      html += auctionHistory.slice().reverse().map(item => {
        const isWon = item.status === 'WON';
        return `
          <div class="trade-list-item">
            <div class="trade-item-header">
              <span class="trade-status-badge ${isWon ? 'accepted' : 'declined'}">${isWon ? 'Sold' : 'Unsold'}</span>
              <span style="font-size:0.68rem;color:var(--text-dim);">${item.time ? new Date(item.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
            </div>
            <div class="trade-item-text">
              ${isWon ? `<strong>${item.tile_name}</strong> won by <strong>${item.winner_name}</strong> for <strong>$${item.bid}</strong>` : `<strong>${item.tile_name}</strong> ended with no bids`}
            </div>
          </div>
        `;
      }).join('');
    } else {
      html += `<div class="trade-empty-state">No auction history yet.</div>`;
    }

    container.innerHTML = html;
  }

  placeAuctionBid(amount) {
    this.placeBid(amount);
  }

  passAuctionBid() {
    this.passBid();
  }

  submitSidebarBid() {
    const input = document.getElementById('sidebar-auction-bid-input');
    if (!input) return;
    const val = parseInt(input.value, 10);
    if (isNaN(val) || val <= 0) return;
    this.placeBid(val);
  }

  reopenAuctionModal() {
    this.heldAuctionTileId = null;
    this.renderAuction();
  }

  // ================= Flying Cash Delta Animation =================
  triggerCashDeltaAnimation(player, diff) {
    if (diff === 0) return;
    if (!this.activeCashDeltaNodes) this.activeCashDeltaNodes = {};

    const isProfit = diff > 0;
    const text = isProfit ? `+${diff}` : `${diff}`;
    const cssClass = isProfit ? 'profit' : 'loss';

    // Remove any previous in-flight node for this player to prevent overlap
    if (this.activeCashDeltaNodes[player.id]) {
      const old = this.activeCashDeltaNodes[player.id];
      if (old.parentNode) old.parentNode.removeChild(old);
      delete this.activeCashDeltaNodes[player.id];
    }

    const fly = document.createElement('span');
    fly.id = `flying-delta-${player.id}`;
    fly.className = `flying-cash-delta ${cssClass}`;
    fly.innerText = text;

    this.activeCashDeltaNodes[player.id] = fly;

    // Directly where the player balance is written in the sidebar (#player-cash-${p.id})
    const cashEl = document.getElementById(`player-cash-${player.id}`);
    if (cashEl) {
      cashEl.appendChild(fly);
    }

    fly.addEventListener('animationend', () => {
      if (fly.parentNode) fly.parentNode.removeChild(fly);
      if (this.activeCashDeltaNodes[player.id] === fly) {
        delete this.activeCashDeltaNodes[player.id];
      }
    });

    setTimeout(() => {
      if (fly.parentNode) fly.parentNode.removeChild(fly);
      if (this.activeCashDeltaNodes[player.id] === fly) {
        delete this.activeCashDeltaNodes[player.id];
      }
    }, 2050);
  }

  // ================= Game Over =================
  showGameOverModal() {
    const modal = document.getElementById('modal-gameover');
    const content = document.getElementById('gameover-content');
    if (!modal || !content || !this.gameState) return;

    window.soundEngine.victory();

    const sortedPlayers = [...this.gameState.players].sort((a, b) => b.net_worth - a.net_worth);
    const winner = sortedPlayers[0];

    content.innerHTML = `
      <div style="text-align:center;padding:10px 0;">
        <div style="font-size:3.5rem;margin-bottom:6px;">🏆</div>
        <div style="font-size:1.8rem;font-weight:900;color:#fff;">${winner ? winner.name : 'Nobody'} Wins!</div>
        <div style="color:var(--text-muted);margin-bottom:20px;">Congratulations to the tycoon!</div>

        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:24px;">
          ${sortedPlayers.map((p, idx) => `
            <div class="lobby-player-card" style="flex-direction:row;justify-content:space-between;padding:10px 14px;">
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-weight:800;color:${idx === 0 ? '#fbbf24' : '#94a3b8'};">#${idx + 1}</span>
                <span class="player-avatar-small" style="width:34px;height:34px;font-size:1.25rem;background-color:${p.color};border-color:${darkenColor(p.color, 0.35)};">${p.avatar}</span>
                <span style="font-weight:700;">${p.name}</span>
              </div>
              <div style="text-align:right;">
                <div style="font-weight:800;color:#34d399;">$${p.cash}</div>
                <div style="font-size:0.75rem;color:var(--text-dim);">Net Worth: $${p.net_worth}</div>
              </div>
            </div>
          `).join('')}
        </div>

        ${this.isHost ? `
          <button class="btn-primary" onclick="game.restartGame()">🔄 Rematch / Return to Lobby</button>
        ` : `
          <div style="color:var(--text-dim);font-size:0.9rem;">Waiting for host to restart match...</div>
        `}
      </div>
    `;

    this.openModal('modal-gameover');
  }

  restartGame() {
    this.sendAction({ action: 'RESTART_GAME' });
    this.closeAllModals();
  }

  // ================= Modal Utilities =================
  showActionReasonPopup(title, message, icon = '🚫') {
    const titleEl = document.getElementById('action-reason-title-text');
    const msgEl = document.getElementById('action-reason-message');
    const iconEl = document.getElementById('action-reason-icon');
    if (titleEl) titleEl.innerText = title;
    if (msgEl) msgEl.innerText = message;
    if (iconEl) iconEl.innerText = icon;
    this.openModal('modal-action-reason');
    if (window.soundEngine && typeof window.soundEngine.cardEffect === 'function') {
      window.soundEngine.cardEffect();
    }
  }

  openModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.add('active');
  }

  closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.remove('active');
  }

  closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
  }

  displayReaction(msg) {
    const zone = document.getElementById('reactions-display-zone');
    if (!zone) return;

    const bubble = document.createElement('div');
    bubble.className = 'reaction-bubble';
    bubble.innerHTML = `
      <span class="reaction-sender">${msg.avatar || '👤'} ${msg.senderName || 'Player'}:</span>
      <span class="reaction-emoji">${msg.emoji}</span>
    `;
    zone.appendChild(bubble);

    // Limit simultaneous bubbles to 5
    while (zone.children.length > 5) {
      zone.removeChild(zone.children[0]);
    }

    setTimeout(() => {
      if (bubble.parentNode) bubble.parentNode.removeChild(bubble);
    }, 2400);
  }

  showToast(text, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${text}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }
}

// Global initialization
window.game = new RichupGame();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.game.init();
  });
} else {
  window.game.init();
}
