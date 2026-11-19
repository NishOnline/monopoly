/**
 * Richup.io 1-1 Clone Game Client Engine
 * Complete client-side state manager, animations, board renderer & WebSockets controller
 */

// Crisp Circular SVG Flag Badges (Matching Richup.io exact tile design)
const CIRCULAR_FLAGS = {
  IT: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#f8fafc"/><path d="M0,0 H10.67 V32 H0 Z" fill="#009246"/><path d="M21.33,0 H32 V32 H21.33 Z" fill="#ce2b37"/></svg>`,
  HU: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#ffffff"/><path d="M0,0 H32 V10.67 H0 Z" fill="#ce2939"/><path d="M0,21.33 H32 V32 H0 Z" fill="#477050"/></svg>`,
  GR: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#0d5eaf"/><path d="M0,6 H32 M0,13 H32 M0,19 H32 M0,26 H32" stroke="#ffffff" stroke-width="3"/><rect x="0" y="0" width="15" height="15" fill="#0d5eaf"/><path d="M7.5,0 V15 M0,7.5 H15" stroke="#ffffff" stroke-width="3"/></svg>`,
  PL: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#ffffff"/><path d="M0,16 H32 V32 H0 Z" fill="#dc143c"/></svg>`,
  CZ: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#ffffff"/><path d="M0,16 H32 V32 H0 Z" fill="#d7141a"/><polygon points="0,0 17,16 0,32" fill="#11457e"/></svg>`,
  BE: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#fdd116"/><path d="M0,0 H10.67 V32 H0 Z" fill="#000000"/><path d="M21.33,0 H32 V32 H21.33 Z" fill="#ef3340"/></svg>`,
  NL: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#ffffff"/><path d="M0,0 H32 V10.67 H0 Z" fill="#ae1c28"/><path d="M0,21.33 H32 V32 H0 Z" fill="#21468b"/></svg>`,
  DE: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#ffce00"/><path d="M0,0 H32 V10.67 H0 Z" fill="#000000"/><path d="M0,10.67 H32 V21.33 H0 Z" fill="#dd0000"/></svg>`,
  ES: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#ffc400"/><path d="M0,0 H32 V8 H0 Z" fill="#aa151b"/><path d="M0,24 H32 V32 H0 Z" fill="#aa151b"/></svg>`,
  GB: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#012169"/><path d="M0,0 L32,32 M32,0 L0,32" stroke="#ffffff" stroke-width="5.5"/><path d="M0,0 L32,32 M32,0 L0,32" stroke="#c8102e" stroke-width="2.5"/><path d="M16,0 V32 M0,16 H32" stroke="#ffffff" stroke-width="9"/><path d="M16,0 V32 M0,16 H32" stroke="#c8102e" stroke-width="5.5"/></svg>`,
  AU: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#00008b"/><rect x="0" y="0" width="16" height="16" fill="#012169"/><path d="M0,0 L16,16 M16,0 L0,16" stroke="#ffffff" stroke-width="3"/><path d="M8,0 V16 M0,8 H16" stroke="#c8102e" stroke-width="2"/><circle cx="24" cy="7" r="1.5" fill="#ffffff"/><circle cx="26" cy="16" r="1.5" fill="#ffffff"/><circle cx="21" cy="22" r="1.5" fill="#ffffff"/><circle cx="8" cy="23" r="2.5" fill="#ffffff"/></svg>`,
  CA: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#ffffff"/><path d="M0,0 H8 V32 H0 Z M24,0 H32 V32 H24 Z" fill="#ff0000"/><path d="M16,8 L18,13 L21,11 L19,16 L21,19 L16,17 L11,19 L13,16 L11,11 L14,13 Z" fill="#ff0000"/></svg>`,
  US: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#ffffff"/><path d="M0,4 H32 M0,9 H32 M0,14 H32 M0,19 H32 M0,24 H32 M0,29 H32" stroke="#b22234" stroke-width="2.5"/><rect x="0" y="0" width="16" height="16" fill="#3c3b6e"/><circle cx="4" cy="4" r="1" fill="#fff"/><circle cx="9" cy="8" r="1" fill="#fff"/><circle cx="13" cy="4" r="1" fill="#fff"/><circle cx="4" cy="12" r="1" fill="#fff"/><circle cx="12" cy="12" r="1" fill="#fff"/></svg>`,
  IN: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#ffffff"/><path d="M0,0 H32 V10.67 H0 Z" fill="#ff9933"/><path d="M0,21.33 H32 V32 H0 Z" fill="#138808"/><circle cx="16" cy="16" r="3.5" fill="none" stroke="#000080" stroke-width="0.8"/><circle cx="16" cy="16" r="0.8" fill="#000080"/></svg>`,
  TR: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#334155"/><text x="16" y="21" font-size="15" text-anchor="middle">🚂</text></svg>`,
  UT: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#581c87"/><text x="16" y="21" font-size="15" text-anchor="middle">⚡</text></svg>`,
  CHEST: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#1e3a8a"/><text x="16" y="21" font-size="14" text-anchor="middle">🎁</text></svg>`,
  CHANCE: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#b45309"/><text x="16" y="22" font-size="16" font-weight="900" text-anchor="middle" fill="#fff">?</text></svg>`,
  TAX: `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#7f1d1d"/><text x="16" y="21" font-size="14" text-anchor="middle">💰</text></svg>`
};

function getCircularFlagSvg(code) {
  return CIRCULAR_FLAGS[code] || `<svg viewBox="0 0 32 32" class="flag-circle-svg"><circle cx="16" cy="16" r="16" fill="#3b82f6"/><text x="16" y="21" font-size="14" text-anchor="middle" fill="#fff">🌐</text></svg>`;
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

    // Animation tracking
    this.previousPositions = {};
    this.previousCash = {};
    this.isRolling = false;
    this.soundMuted = false;

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
    this.initDOM();
    this.loadProfileFromStorage();
    await this.fetchBoardData();
    this.renderBoardSkeleton();
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
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
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

    // Lobby tabs (Create / Join)
    document.querySelectorAll('.lobby-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.lobby-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const targetId = tab.getAttribute('data-target');
        const target = document.getElementById(targetId);
        if (target) target.classList.add('active');
      });
    });

    // Avatar pickers
    document.querySelectorAll('.avatar-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.avatar-opt').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        this.selectedAvatar = opt.getAttribute('data-avatar');
        this.updateProfile();
      });
    });

    // Color pickers
    document.querySelectorAll('.color-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        if (opt.classList.contains('taken')) {
          this.showActionReasonPopup('Color Already Taken', 'Another player is already using this color in this room. Please select a different color.');
          return;
        }
        document.querySelectorAll('.color-opt').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        this.selectedColor = opt.getAttribute('data-color');
        this.updateProfile();
      });
    });

    // Privacy toggle buttons on Create Room pane
    const privacyBtns = document.querySelectorAll('#privacy-toggle-create .privacy-btn');
    privacyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        privacyBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const val = btn.getAttribute('data-value');
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
        this.connectAndSend({
          action: 'CREATE_ROOM',
          playerId: this.playerId,
          playerName: this.playerName,
          avatar: this.selectedAvatar,
          color: this.selectedColor,
          is_public: isPublic
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
        this.sendAction({ action: 'START_GAME' });
      });
    }

    // Host Settings Changes (Toggleable room rules)
    const settingIds = [
      'setting-cash', 'setting-timer', 'setting-parking', 'setting-auction',
      'setting-double-rent', 'setting-prison-rent', 'setting-even-build', 'setting-mortgage',
      'setting-privacy'
    ];
    settingIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', () => this.applySettings());
      }
    });

    // In-Game Central Action Buttons
    const rollBtn = document.getElementById('btn-action-roll');
    if (rollBtn) {
      rollBtn.addEventListener('click', () => {
        if (this.isRolling || this.isSpectator) return;
        this.triggerDiceAnimation();
        this.sendAction({ action: 'ROLL_DICE' });
      });
    }

    const buyBtn = document.getElementById('btn-action-buy');
    if (buyBtn) {
      buyBtn.addEventListener('click', () => {
        this.sendAction({ action: 'BUY_PROPERTY' });
      });
    }

    const declineBtn = document.getElementById('btn-action-auction');
    if (declineBtn) {
      declineBtn.addEventListener('click', () => {
        this.sendAction({ action: 'DECLINE_PROPERTY' });
      });
    }

    const endTurnBtn = document.getElementById('btn-action-end');
    if (endTurnBtn) {
      endTurnBtn.addEventListener('click', () => {
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

    // Quick Reaction Buttons (Both active players and spectators)
    document.querySelectorAll('.reaction-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const emoji = btn.getAttribute('data-emoji');
        this.sendAction({
          action: 'SEND_REACTION',
          emoji: emoji
        });
      });
    });

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

  async fetchBoardData() {
    try {
      const res = await fetch('/api/board?t=' + Date.now(), { cache: 'no-store' });
      this.boardData = await res.json();
    } catch (e) {
      console.error('Failed to load board data', e);
    }
  }

  async fetchOpenRooms() {
    try {
      const res = await fetch('/api/rooms');
      const data = await res.json();
      const listEl = document.getElementById('public-rooms-list');
      if (!listEl) return;
      if (!data.rooms || data.rooms.length === 0) {
        listEl.innerHTML = '<div style="color:var(--text-dim);font-size:0.85rem;padding:8px;">No open public games right now. Create one!</div>';
        return;
      }
      listEl.innerHTML = data.rooms.map(r => {
        const isPlaying = r.state === 'PLAYING';
        return `
          <div class="lobby-player-card" style="flex-direction:row;justify-content:space-between;align-items:center;cursor:pointer;padding:8px 12px;" onclick="game.quickJoin('${r.roomId}')">
            <div>
              <span style="font-weight:800;color:#38bdf8;font-family:monospace;font-size:0.95rem;">${r.roomId}</span>
              <span style="font-size:0.8rem;color:var(--text-muted);margin-left:8px;">Host: ${r.hostName}</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              <span class="lobby-player-tag ${isPlaying ? 'bot' : ''}">
                ${isPlaying ? '👁️ LIVE' : `${r.playersCount}/${r.maxPlayers}`}
              </span>
              <button class="mini-trade-btn" style="${isPlaying ? 'background:rgba(139,92,246,0.25);color:#c084fc;border-color:rgba(139,92,246,0.5);' : ''}">
                ${isPlaying ? '👁️ Spectate' : 'Join'}
              </button>
            </div>
          </div>
        `;
      }).join('');
    } catch (e) {
      console.error('Failed to fetch rooms', e);
    }
  }

  quickJoin(code) {
    const codeInput = document.getElementById('input-room-code');
    if (codeInput) codeInput.value = code;
    const nameInput = document.getElementById('input-join-name');
    if (nameInput) this.playerName = nameInput.value.trim() || 'Player';
    this.connectAndSend({
      action: 'JOIN_ROOM',
      roomId: code,
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

      // 1. Turn timer: active countdown for WAITING_ROLL and LANDED_ACTION; PAUSED after playing turn till End Turn is pressed UNLESS player is in debt (negative cash)
      const currPlayer = state.players ? state.players.find(p => p.id === state.current_player_id) : null;
      const isCurrInDebt = currPlayer && currPlayer.cash < 0;

      if (state.turn_phase === 'WAITING_ROLL' || state.turn_phase === 'LANDED_ACTION' || (state.turn_phase === 'WAITING_END_TURN' && isCurrInDebt)) {
        if (typeof this.currentTurnTimeLeft === 'number' && this.currentTurnTimeLeft > 0) {
          this.currentTurnTimeLeft = Math.max(0, this.currentTurnTimeLeft - 0.25);
          const secs = Math.ceil(this.currentTurnTimeLeft);
          if (timerBox) {
            timerBox.innerText = `${secs}s`;
            timerBox.classList.toggle('urgent', secs <= 10 || isCurrInDebt);
            timerBox.title = isCurrInDebt ? 'Liquidate properties before debt timer expires!' : 'Time remaining for turn action';
          }
        }
      } else if (state.turn_phase === 'WAITING_END_TURN') {
        if (timerBox) {
          timerBox.innerText = '⏸️';
          timerBox.classList.remove('urgent');
          timerBox.title = 'Turn timer paused - manage properties or press End Turn';
        }
      }

      // 2. Auction timer: ends 3 seconds after players hold their final bet
      if (state.turn_phase === 'AUCTION' && state.auction) {
        const auc = state.auction;
        const aucTimer = document.getElementById('auction-timer-pill');
        if (aucTimer) {
          if (auc.deadline) {
            const now = Date.now() / 1000;
            const diff = Math.max(0, (auc.deadline - now));
            const displaySecs = Math.ceil(diff);
            if (displaySecs > 0) {
              aucTimer.innerHTML = `⏱️ Ending in <strong>${displaySecs}s</strong>`;
              aucTimer.classList.add('urgent');
            } else {
              aucTimer.innerHTML = `🔨 Concluding...`;
            }
          } else {
            aucTimer.innerHTML = `⚖️ Place your bet • 3s timer starts on first bet`;
            aucTimer.classList.remove('urgent');
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
          this.showLobbyRoomView();
        }
        break;

      case 'GAME_STATE':
        this.updateGameState(msg.data);
        break;

      case 'REACTION':
        this.displayReaction(msg);
        break;

      case 'ERROR':
        this.showToast(msg.message, 'error');
        break;

      case 'ACTION_ERROR':
        this.showActionReasonPopup(msg.title || 'Action Not Allowed', msg.message || 'This action is not possible.');
        break;

      case 'LEFT_ROOM':
        this.resetToMainMenu();
        break;
    }
  }

  showLobbyRoomView() {
    document.getElementById('lobby-welcome-view').style.display = 'none';
    document.getElementById('room-lobby-view').style.display = 'block';
  }

  resetToMainMenu() {
    this.roomId = null;
    this.playerId = null;
    this.isHost = false;
    this.isSpectator = false;
    this.gameState = null;
    document.getElementById('nav-room-badge').style.display = 'none';
    const specPill = document.getElementById('nav-spectator-pill');
    if (specPill) specPill.style.display = 'none';
    document.getElementById('screen-welcome').classList.add('active');
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('lobby-welcome-view').style.display = 'block';
    document.getElementById('room-lobby-view').style.display = 'none';
    this.fetchOpenRooms();
  }

  updateProfile() {
    this.sendAction({
      action: 'UPDATE_PROFILE',
      avatar: this.selectedAvatar,
      color: this.selectedColor
    });
  }

  applySettings() {
    if (!this.isHost) return;
    const startingCash = parseInt(document.getElementById('setting-cash').value, 10);
    const turnTimer = parseInt(document.getElementById('setting-timer').value, 10);
    const parkingJackpot = document.getElementById('setting-parking').value === 'true';
    const auctionOnDecline = document.getElementById('setting-auction').value === 'true';
    const doubleRent = document.getElementById('setting-double-rent').value === 'true';
    const prisonRent = document.getElementById('setting-prison-rent').value === 'true';
    const evenBuild = document.getElementById('setting-even-build').value === 'true';
    const mortgage = document.getElementById('setting-mortgage').value === 'true';
    const privacyEl = document.getElementById('setting-privacy');
    const isPublic = privacyEl ? privacyEl.value === 'true' : false;

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
        is_public: isPublic
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

    // Reset spectator and bankrupt state when in lobby for players in the room
    const myPlayerInList = data.players ? data.players.find(p => p.id === this.playerId) : null;
    if (data.state === 'LOBBY') {
      if (myPlayerInList) {
        this.isSpectator = false;
      }
      this.closeModal('modal-gameover');
      this.closeModal('modal-confirm-bankruptcy');
      document.getElementById('screen-welcome').classList.add('active');
      document.getElementById('game-screen').classList.remove('active');
      document.getElementById('lobby-welcome-view').style.display = 'none';
      document.getElementById('room-lobby-view').style.display = 'block';
    }

    // Sync settings across clients in lobby
    if (data.settings) {
      if (document.getElementById('setting-cash')) document.getElementById('setting-cash').value = data.settings.starting_cash || 1500;
      if (document.getElementById('setting-timer')) document.getElementById('setting-timer').value = data.settings.turn_timer_seconds || 45;
      if (document.getElementById('setting-parking')) document.getElementById('setting-parking').value = String(data.settings.free_parking_jackpot);
      if (document.getElementById('setting-auction')) document.getElementById('setting-auction').value = String(data.settings.auction_on_decline);
      if (document.getElementById('setting-double-rent')) document.getElementById('setting-double-rent').value = String(data.settings.double_rent_full_set !== false);
      if (document.getElementById('setting-prison-rent')) document.getElementById('setting-prison-rent').value = String(data.settings.no_rent_in_prison !== false);
      if (document.getElementById('setting-even-build')) document.getElementById('setting-even-build').value = String(data.settings.even_build !== false);
      if (document.getElementById('setting-mortgage')) document.getElementById('setting-mortgage').value = String(data.settings.mortgage_enabled !== false);
      if (document.getElementById('setting-privacy')) document.getElementById('setting-privacy').value = String(data.settings.is_public === true);

      // Disable inputs for non-host players, enable for host
      const isHost = this.isHost;
      ['setting-cash', 'setting-timer', 'setting-parking', 'setting-auction',
       'setting-double-rent', 'setting-prison-rent', 'setting-even-build', 'setting-mortgage',
       'setting-privacy'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.disabled = !isHost;
      });
    }

    // Detect switch from LOBBY to PLAYING (or if spectator already on game screen)
    if (data.state === 'PLAYING') {
      this.closeModal('modal-gameover');
      document.getElementById('screen-welcome').classList.remove('active');
      document.getElementById('game-screen').classList.add('active');
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

    // Play sounds and animations on state changes
    this.handleSoundAndFX(prevState, data);

    // Render Board Tiles (owners, houses, mortgages)
    this.renderTileStates();

    // Render Player Tokens
    this.renderPlayerTokens();

    // Render Center Deck
    this.renderCenterDeck();

    // Render Sidebar (Players and Activity Feed)
    this.renderSidebar();

    // Render Active Auction if present
    this.renderAuction();

    // Check for incoming trades (only for active non-spectators)
    if (!this.isSpectator && myPlayer && !myPlayer.is_bankrupt) {
      this.checkIncomingTrades();
    }
  }

  handleSoundAndFX(prev, curr) {
    if (!prev) return;

    // 1. Dice roll 3D animation and sound (for any player or bot)
    const diceChanged = curr.last_dice && (!prev.last_dice || prev.last_dice[0] !== curr.last_dice[0] || prev.last_dice[1] !== curr.last_dice[1]);
    const rollPhaseTransition = prev.turn_phase === 'WAITING_ROLL' && curr.turn_phase !== 'WAITING_ROLL';
    if ((diceChanged || rollPhaseTransition) && !this.isRolling) {
      const d1 = curr.last_dice ? curr.last_dice[0] : 1;
      const d2 = curr.last_dice ? curr.last_dice[1] : 1;
      this.triggerDiceAnimation(d1, d2);
    }

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

    // 3. Jackpot change sound
    if (curr.free_parking_pool > (prev.free_parking_pool || 0)) {
      window.soundEngine.moneyGain();
    }

    // 4. Flying cash delta (+/- flying text for 2 sec)
    if (curr.players) {
      curr.players.forEach(p => {
        const prevCash = this.previousCash[p.id];
        if (prevCash !== undefined && prevCash !== p.cash) {
          const diff = p.cash - prevCash;
          this.triggerCashDeltaAnimation(p, diff);
        }
        this.previousCash[p.id] = p.cash;
      });
    }

    // Free parking banner
    const jpEl = document.getElementById('nav-jackpot-pill');
    const jpVal = document.getElementById('jackpot-pool-amount');
    if (jpEl && jpVal) {
      if (curr.settings.free_parking_jackpot) {
        jpEl.style.display = 'flex';
        jpVal.innerText = `$${curr.free_parking_pool}`;
      } else {
        jpEl.style.display = 'none';
      }
    }
  }

  // ================= Board Skeleton & Tile Rendering (Matching User's Image 1-1) =================
  renderBoardSkeleton() {
    const board = document.getElementById('monopoly-board');
    if (!board || !this.boardData) return;

    // Remove existing tile slots, keeping .board-center inside the grid
    board.querySelectorAll('.tile').forEach(el => el.remove());

    const tiles = this.boardData.tiles;
    let html = '';

    tiles.forEach(tile => {
      const id = tile.id;
      let extraClass = `tile-${id}`;
      let content = '';

      if (id === 0) {
        extraClass += ' tile-corner';
        content = `<div class="corner-icon">🚩</div><div class="corner-name">COLLECT $200 SALARY AS YOU PASS<br><strong>GO</strong></div>`;
      } else if (id === 10) {
        extraClass += ' tile-corner';
        content = `<div class="corner-icon">👮</div><div class="corner-name">JUST VISITING<br>/ IN JAIL</div>`;
      } else if (id === 20) {
        extraClass += ' tile-corner';
        content = `<div class="corner-icon">🅿️</div><div class="corner-name">FREE<br>PARKING</div>`;
      } else if (id === 30) {
        extraClass += ' tile-corner';
        content = `<div class="corner-icon">🚨</div><div class="corner-name">GO TO<br>JAIL</div>`;
      } else {
        // Edge tiles: authentic Richup.io design matching user image!
        if (id >= 1 && id <= 9) extraClass += ' edge-bottom';
        else if (id >= 11 && id <= 19) extraClass += ' edge-left';
        else if (id >= 21 && id <= 29) extraClass += ' edge-top';
        else if (id >= 31 && id <= 39) extraClass += ' edge-right';

        let colorBar = '';
        if (tile.type === 'property' || tile.type === 'railroad' || tile.type === 'utility') {
          colorBar = `<div class="color-bar" id="colorbar-tile-${id}" style="display:none;"></div>`;
        }

        const priceText = tile.price ? `${tile.price} $` : (tile.tax_amount ? `${tile.tax_amount} $` : '');

        // Circular Flag / Symbol SVG Badge
        let flagCode = tile.country_code;
        if (!flagCode) {
          if (tile.type === 'chest') flagCode = 'CHEST';
          else if (tile.type === 'chance') flagCode = 'CHANCE';
          else if (tile.type === 'tax') flagCode = 'TAX';
        }
        const flagCircle = `<div class="richup-flag-circle">${getCircularFlagSvg(flagCode)}</div>`;

        // Price tag in translucent rounded pill
        const priceTag = priceText ? `<div class="richup-price-tag">${priceText}</div>` : '';

        // City name & price tag stacked in richup-tile-info container so names fit beautifully
        const tileInfo = `
          <div class="richup-tile-info">
            <div class="richup-city-name" title="${tile.name}">${tile.name}</div>
            ${priceTag}
          </div>
        `;

        content = `
          ${colorBar}
          <div class="house-container" id="houses-tile-${id}"></div>
          ${flagCircle}
          ${tileInfo}
          <div class="owner-indicator" id="owner-tile-${id}"></div>
          <div class="mortgaged-overlay" id="mortgage-tile-${id}" style="display:none;">
            <span class="mortgage-label">MORTGAGED</span>
          </div>
        `;
      }

      html += `
        <div class="tile ${extraClass}" id="tile-slot-${id}" onclick="game.inspectProperty(${id})">
          ${content}
          <div class="tokens-container" id="tokens-tile-${id}"></div>
        </div>
      `;
    });

    const centerEl = board.querySelector('.board-center');
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
      brown: { color: '#92400e' },
      lightblue: { color: '#38bdf8' },
      pink: { color: '#f472b6' },
      orange: { color: '#fb923c' },
      red: { color: '#ef4444' },
      yellow: { color: '#facc15' },
      green: { color: '#22c55e' },
      darkblue: { color: '#3b82f6' },
      railroad: { color: '#94a3b8' },
      utility: { color: '#fbbf24' }
    };

    this.boardData.tiles.forEach(tile => {
      const state = tileStates[tile.id];
      if (!state) return;

      const tileSlot = document.getElementById(`tile-slot-${tile.id}`);
      const colorBar = tileSlot ? tileSlot.querySelector('.color-bar') : null;
      const ownerEl = document.getElementById(`owner-tile-${tile.id}`);

      if (state.owner && playersById[state.owner]) {
        const owner = playersById[state.owner];

        // Owned property: show ONLY the color of the person who owns it & fill inside area
        if (colorBar) {
          colorBar.style.display = 'block';
          colorBar.style.setProperty('background-color', owner.color, 'important');
          colorBar.style.boxShadow = `0 0 10px ${owner.color}`;
        }
        if (tileSlot) {
          tileSlot.style.borderColor = owner.color;
          tileSlot.style.background = `linear-gradient(135deg, ${owner.color}45 0%, ${owner.color}22 100%), rgba(15, 23, 42, 0.85)`;
          tileSlot.style.boxShadow = `0 4px 16px ${owner.color}35, inset 0 0 20px ${owner.color}40`;
        }
        if (ownerEl) {
          ownerEl.style.display = 'none';
        }
      } else {
        // Unowned property: show NO color on the map. Keep only the flag.
        if (colorBar) {
          colorBar.style.display = 'none';
          colorBar.style.removeProperty('background-color');
          colorBar.style.removeProperty('box-shadow');
        }
        if (ownerEl) {
          ownerEl.style.display = 'none';
        }
        if (tileSlot) {
          tileSlot.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          tileSlot.style.background = '';
          tileSlot.style.boxShadow = '';
        }
      }

      // 2. Mortgaged
      const mortEl = document.getElementById(`mortgage-tile-${tile.id}`);
      if (mortEl) {
        mortEl.style.display = state.mortgaged ? 'flex' : 'none';
      }

      // 3. Houses / Hotels
      const houseEl = document.getElementById(`houses-tile-${tile.id}`);
      if (houseEl) {
        if (state.houses === 5) {
          houseEl.innerHTML = '<div class="hotel-pip"></div>';
        } else if (state.houses > 0) {
          houseEl.innerHTML = Array(state.houses).fill('<div class="house-pip"></div>').join('');
        } else {
          houseEl.innerHTML = '';
        }
      }
    });
  }

  renderPlayerTokens() {
    if (!this.gameState) return;

    const activePlayerIds = new Set();

    this.gameState.players.forEach(p => {
      activePlayerIds.add(p.id);

      if (p.is_bankrupt) {
        const existingToken = document.getElementById(`player-token-${p.id}`);
        if (existingToken) existingToken.remove();
        delete this.previousPositions[p.id];
        return;
      }

      const prevPos = this.previousPositions[p.id];
      const targetPos = p.position;

      // Find or create player token element
      let token = document.getElementById(`player-token-${p.id}`);
      if (!token) {
        token = document.createElement('div');
        token.id = `player-token-${p.id}`;
        token.className = 'player-token';
        token.style.borderColor = p.color;
        token.innerHTML = p.avatar;
      }
      token.title = `${p.name} ($${p.cash})`;

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

      // Initial placement (no prior recorded position) or position unchanged
      if (prevPos === undefined || prevPos === targetPos) {
        const slot = document.getElementById(`tokens-tile-${targetPos}`);
        if (slot && token.parentElement !== slot) {
          slot.appendChild(token);
        }
        this.previousPositions[p.id] = targetPos;
        return;
      }

      // Position changed -> animate smooth swish from prevPos to targetPos!
      this.animatePlayerSwish(p, token, prevPos, targetPos);
    });

    // Remove tokens for players who left or were removed
    document.querySelectorAll('.player-token').forEach(tok => {
      const pid = tok.id.replace('player-token-', '');
      if (!activePlayerIds.has(pid)) {
        tok.remove();
        delete this.previousPositions[pid];
      }
    });
  }

  animatePlayerSwish(p, token, startPos, endPos) {
    if (!this.activeSwishTimers) this.activeSwishTimers = {};
    if (this.activeSwishTimers[p.id]) {
      this.activeSwishTimers[p.id].forEach(t => clearTimeout(t));
      this.activeSwishTimers[p.id] = [];
    }
    this.activeSwishTimers[p.id] = [];

    // Compute step path along board
    let path = [];
    if (p.in_jail && endPos === 10 && startPos !== 9) {
      path = [10]; // Direct to jail
    } else {
      const numSteps = (endPos - startPos + 40) % 40;
      for (let s = 1; s <= numSteps; s++) {
        path.push((startPos + s) % 40);
      }
    }

    if (path.length === 0) {
      this.previousPositions[p.id] = endPos;
      return;
    }

    // Step duration: between 60ms and 95ms per tile step
    const stepInterval = Math.max(55, Math.min(95, Math.floor(650 / path.length)));

    path.forEach((tileIdx, idx) => {
      const timer = setTimeout(() => {
        const slot = document.getElementById(`tokens-tile-${tileIdx}`);
        if (slot) {
          slot.appendChild(token);
          token.classList.remove('swishing');
          void token.offsetWidth; // trigger reflow for smooth re-animation
          token.classList.add('swishing');
          window.soundEngine.swish();
        }

        if (idx === path.length - 1) {
          this.previousPositions[p.id] = endPos;
          setTimeout(() => token.classList.remove('swishing'), 160);
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

    // Turn indicator
    const turnPill = document.getElementById('center-turn-pill');
    if (turnPill) {
      turnPill.innerHTML = `
        <div class="pulse-dot" style="background:${currPlayer.color}"></div>
        <span>${isMyTurn ? 'Your Turn' : `${currPlayer.name}'s Turn`}</span>
      `;
    }

    // Turn timer
    this.currentTurnTimeLeft = state.turn_time_left;
    const timerBox = document.getElementById('center-timer-box');
    if (timerBox) {
      if (state.turn_phase === 'WAITING_END_TURN' && currPlayer.cash >= 0) {
        timerBox.innerText = '⏸️';
        timerBox.classList.remove('urgent');
        timerBox.title = 'Turn timer paused - manage properties or press End Turn';
      } else {
        timerBox.innerText = `${state.turn_time_left}s`;
        if (state.turn_time_left <= 10 || currPlayer.cash < 0) {
          timerBox.classList.add('urgent');
        } else {
          timerBox.classList.remove('urgent');
        }
        if (currPlayer.cash < 0) {
          timerBox.title = 'Resolve negative balance before timer expires!';
        }
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
    const endTurnBtn = document.getElementById('btn-action-end');
    const jailFineBtn = document.getElementById('btn-action-jail-fine');
    const jailCardBtn = document.getElementById('btn-action-jail-card');
    const debtBtn = document.getElementById('btn-action-debt');
    const bankruptBtn = document.getElementById('btn-action-bankrupt');

    // Hide all action controls initially
    [rollBtn, buyBtn, auctionBtn, endTurnBtn, jailFineBtn, jailCardBtn, debtBtn, bankruptBtn].forEach(b => {
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

      if (isMyTurn) {
        if (buyBtn && currPlayer.cash >= tile.price) {
          buyBtn.innerHTML = `🏡 Buy ${tile.name} ($${tile.price})`;
          buyBtn.style.display = 'flex';
        }
        if (auctionBtn) {
          auctionBtn.style.display = 'flex';
        }
      }
    } else if (state.turn_phase === 'WAITING_END_TURN') {
      const inDebt = currPlayer.cash < 0;
      if (inDebt) {
        promptEl.innerHTML = isMyTurn
          ? `<div class="debt-warning-box">⚠️ <strong>Negative Balance: -$${Math.abs(currPlayer.cash)}</strong><br>You cannot end turn. Mortgage properties or trade to restore positive funds before time runs out, or bankruptcy will be declared!</div>`
          : `<span style="color:#ef4444;">${currPlayer.name} owes money ($${currPlayer.cash})</span> and must liquidate properties or trade...`;
      } else {
        promptEl.innerText = isMyTurn ? 'Manage properties or pass turn.' : `Waiting for ${currPlayer.name}...`;
      }
      if (isMyTurn && endTurnBtn) {
        endTurnBtn.style.display = 'flex';
        if (inDebt) {
          endTurnBtn.disabled = true;
          endTurnBtn.innerHTML = `<span>⚠️ Debt: $${currPlayer.cash} (Can't End Turn)</span>`;
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

  setDiceFaces(d1, d2) {
    const die1 = document.getElementById('die-1');
    const die2 = document.getElementById('die-2');
    if (!die1 || !die2) return;

    die1.setAttribute('data-val', d1);
    die2.setAttribute('data-val', d2);

    die1.innerHTML = Array(d1).fill('<div class="pip"></div>').join('');
    die2.innerHTML = Array(d2).fill('<div class="pip"></div>').join('');
  }

  triggerDiceAnimation(targetD1, targetD2) {
    if (this.isRolling) return;
    this.isRolling = true;
    const die1 = document.getElementById('die-1');
    const die2 = document.getElementById('die-2');
    if (die1) {
      die1.classList.remove('rolling');
      void die1.offsetWidth;
      die1.classList.add('rolling');
    }
    if (die2) {
      die2.classList.remove('rolling');
      void die2.offsetWidth;
      die2.classList.add('rolling');
    }

    window.soundEngine.diceRoll();

    setTimeout(() => {
      this.isRolling = false;
      if (die1) die1.classList.remove('rolling');
      if (die2) die2.classList.remove('rolling');

      const d1 = targetD1 || (this.gameState && this.gameState.last_dice ? this.gameState.last_dice[0] : 1);
      const d2 = targetD2 || (this.gameState && this.gameState.last_dice ? this.gameState.last_dice[1] : 1);
      this.setDiceFaces(d1, d2);
      window.soundEngine.diceResult();
    }, 420);
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
            const tile = this.boardData.tiles[tid];
            const state = this.gameState.tile_states[tid];
            const gColor = tile.group && this.boardData.color_groups[tile.group] ? this.boardData.color_groups[tile.group].color : '#888';
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
            } else if (p.monopolies && p.monopolies.includes(tile.group) && this.gameState.settings && this.gameState.settings.double_rent_full_set) {
              statusBadge = `<span class="popover-badge-x2">x2 Rent ($${tile.rent[0] * 2})</span>`;
            } else {
              statusBadge = `<span style="color:#cbd5e1;">Rent: $${tile.rent ? tile.rent[0] : (tile.type === 'railroad' ? 25 : 4)}</span>`;
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
                <div class="player-avatar-small" style="border-color:${p.color}">${p.avatar}</div>
                <div class="player-name-col">
                  <div class="player-name-text">
                    ${p.name}
                    ${p.is_bot ? '<span class="player-status-badge badge-bot">BOT</span>' : ''}
                    ${p.in_jail ? '<span class="player-status-badge badge-jail">JAIL</span>' : ''}
                    ${p.is_bankrupt ? '<span class="player-status-badge badge-bankrupt">BANKRUPT</span>' : ''}
                    ${!p.connected && p.disconnect_deadline ? `
                      <span class="disconnect-timer-badge" data-player-id="${p.id}" data-deadline="${p.disconnect_deadline}">
                        ⚠️ Offline (${p.disconnect_time_left !== null && p.disconnect_time_left !== undefined ? p.disconnect_time_left : Math.max(0, Math.ceil(p.disconnect_deadline - (Date.now() / 1000)))}s)
                      </span>
                    ` : ''}
                  </div>
                  <div class="player-networth">Net Worth: $${p.net_worth}</div>
                </div>
              </div>
              <div class="player-financials">
                <div class="player-cash ${p.cash < 0 ? 'negative-debt' : ''}" id="player-cash-${p.id}">$${p.cash}</div>
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
      avatarEl.style.borderColor = p.color;
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
        } else if (state.houses === 5) {
          rentDisplay = `<span style="color:#34d399;font-weight:700;">$${tile.rent[5]} (Hotel)</span>`;
        } else if (state.houses > 0) {
          rentDisplay = `<span style="color:#34d399;font-weight:700;">$${tile.rent[state.houses]} (🏠×${state.houses})</span>`;
        } else if (p.monopolies && p.monopolies.includes(tile.group) && this.gameState.settings && this.gameState.settings.double_rent_full_set) {
          rentDisplay = `<span style="color:#fbbf24;font-weight:700;">$${tile.rent[0] * 2} (x2 Full Set)</span>`;
        } else {
          rentDisplay = `<span style="color:#cbd5e1;font-weight:700;">$${tile.rent ? tile.rent[0] : 25}</span>`;
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

    grid.innerHTML = this.gameState.players.map(p => `
      <div class="lobby-player-card ${p.id === this.gameState.host_id ? 'host-border' : ''}">
        ${this.isHost && p.id !== this.playerId ? `
          <button class="lobby-kick-btn" onclick="game.kickPlayer('${p.id}')" title="Kick">✕</button>
        ` : ''}
        <div class="lobby-player-avatar" style="border-color:${p.color}">${p.avatar}</div>
        <div class="lobby-player-name">${p.name}</div>
        <span class="lobby-player-tag ${p.id === this.gameState.host_id ? 'host' : (p.is_bot ? 'bot' : '')}">
          ${p.id === this.gameState.host_id ? '👑 HOST' : (p.is_bot ? '🤖 BOT' : 'PLAYER')}
        </span>
      </div>
    `).join('');

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

    // Render lobby chat
    this.renderChatMessages();
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
      const numUtilities = owner ? owner.properties.filter(id => this.boardData.tiles[id] && this.boardData.tiles[id].type === 'utility').length : 0;
      rentSchedule = `
        <div style="font-size:0.8rem;color:#4b5563;margin-bottom:12px;line-height:1.4;">
          <div style="padding:4px 6px;border-radius:4px;${!isMortgaged && numUtilities === 1 ? 'background:rgba(34,197,94,0.16);font-weight:700;color:#15803d;' : ''}">
            If one Utility is owned, rent is 4 times dice roll.${!isMortgaged && numUtilities === 1 ? ' ◀ Current' : ''}
          </div>
          <div style="padding:4px 6px;border-radius:4px;margin-top:4px;${!isMortgaged && numUtilities >= 2 ? 'background:rgba(34,197,94,0.16);font-weight:700;color:#15803d;' : ''}">
            If both Utilities are owned, rent is 10 times dice roll.${!isMortgaged && numUtilities >= 2 ? ' ◀ Current' : ''}
          </div>
        </div>
      `;
    }

    const mortgageValue = tile.mortgage || (tile.price ? tile.price / 2 : 0);
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
        <div class="deed-info-row"><span>Mortgage (50%):</span><span>$${mortgageValue}</span></div>
        <div class="deed-info-row"><span>Status:</span><span style="${isMortgaged ? 'color:#ef4444;font-weight:800;' : ''}">${isMortgaged ? 'MORTGAGED ($0 Rent)' : (state && state.owner ? 'Active' : 'Unowned')}</span></div>
        <div class="deed-info-row"><span>Owner:</span><span style="color:${owner ? owner.color : '#666'}">${owner ? `${owner.name}${owner.in_jail ? ' ⛓️ (In Prison)' : ''}` : 'Unowned'}</span></div>

        <!-- Room Rules Status Pill -->
        <div style="margin-top:10px;padding:8px;background:#f8fafc;border-radius:6px;font-size:0.72rem;color:#475569;line-height:1.35;">
          • <strong>x2 Rent Rule:</strong> ${this.gameState && this.gameState.settings && this.gameState.settings.double_rent_full_set ? 'Enabled (2x base rent on full unimproved set)' : 'Disabled'}<br>
          • <strong>Prison Rule:</strong> ${this.gameState && this.gameState.settings && this.gameState.settings.no_rent_in_prison ? 'No rent collected while owner is in prison' : 'Rent collected normally'}<br>
          • <strong>Even Build Rule:</strong> ${this.gameState && this.gameState.settings && this.gameState.settings.even_build ? 'Enabled (must build/sell evenly across set)' : 'Disabled'}
        </div>

        ${isMine && !this.isSpectator ? `
          <div class="deed-controls">
            ${tile.type === 'property' && state.houses < 5 && !state.mortgaged ? `
              <button class="btn-primary" style="padding:8px;font-size:0.85rem;" onclick="game.buildHouse(${tileId})">🏠 Build House ($${tile.house_cost})</button>
            ` : ''}
            ${tile.type === 'property' && state.houses > 0 ? `
              <button class="btn-secondary" style="padding:8px;font-size:0.85rem;" onclick="game.sellHouse(${tileId})">🔨 Sell House (+$${tile.house_cost / 2})</button>
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

  buildHouse(tileId) {
    const tid = parseInt(tileId, 10);
    const tile = this.boardData && this.boardData.tiles ? this.boardData.tiles[tid] : null;
    const myPlayer = this.gameState && this.gameState.players ? this.gameState.players.find(p => p.id === this.playerId) : null;
    const tileState = this.gameState && this.gameState.tile_states ? this.gameState.tile_states[tid] : null;

    if (tile && myPlayer && tileState) {
      if (tileState.owner !== this.playerId) {
        this.showActionReasonPopup('Cannot Build House', 'You do not own this property.');
        return;
      }
      if (tile.type !== 'property') {
        this.showActionReasonPopup('Cannot Build House', 'Houses can only be built on street properties in color groups.');
        return;
      }
      const groupKey = tile.group;
      const groupTiles = this.boardData.color_groups[groupKey] ? this.boardData.color_groups[groupKey].tiles : [];
      const ownsAll = groupTiles.every(tId => this.gameState.tile_states[tId] && this.gameState.tile_states[tId].owner === this.playerId);
      if (!ownsAll) {
        const gName = this.boardData.color_groups[groupKey] ? this.boardData.color_groups[groupKey].name : 'this';
        this.showActionReasonPopup('Monopoly Required', `You must own all properties in the ${gName} color group before you can build houses.`);
        return;
      }
      const hasMortgaged = groupTiles.some(tId => this.gameState.tile_states[tId] && this.gameState.tile_states[tId].mortgaged);
      if (hasMortgaged) {
        this.showActionReasonPopup('Mortgaged Property', 'You cannot build houses while any property in this color group is mortgaged. Unmortgage it first.');
        return;
      }
      if (tileState.houses >= 5) {
        this.showActionReasonPopup('Maximum Development', 'This property already has a hotel (maximum 5 houses).');
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
        this.showActionReasonPopup('Insufficient Cash', `Building a house on ${tile.name} costs $${tile.house_cost}, but your balance is only $${myPlayer.cash}.`);
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
      if (banner) banner.classList.remove('active');
      return;
    }

    const auc = this.gameState.auction;
    // If the auction has changed to a new property, reset held status
    if (this.heldAuctionTileId && this.heldAuctionTileId !== auc.tile_id) {
      this.heldAuctionTileId = null;
    }

    // If user clicked close/cross on the auction popup, keep it closed (interact from sidebar)
    if (this.heldAuctionTileId === auc.tile_id) {
      if (banner) banner.classList.remove('active');
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
    if (auc.highest_bid > 0 && auc.deadline) {
      const now = Date.now() / 1000;
      const timeLeft = Math.max(0, Math.ceil(auc.deadline - now));
      timerHtml = `
        <div class="timer-box urgent auction-timer-display" id="auction-timer-pill" style="align-self:center;font-size:1.15rem;padding:6px 18px;">
          ⏱️ Ending in <strong>${timeLeft}s</strong>
        </div>
      `;
    } else {
      timerHtml = `
        <div class="timer-box auction-timer-display" id="auction-timer-pill" style="align-self:center;font-size:0.95rem;padding:6px 16px;background:rgba(255,255,255,0.06);color:var(--text-muted);">
          ⚖️ Place your bet • 3s timer starts on first bet
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
      if (myCashMinLbl) myCashMinLbl.innerText = '$0';
      if (myCashMaxLbl) myCashMaxLbl.innerText = `$${myMax}`;
      if (myCashDisplay) myCashDisplay.innerText = `$${myInitialVal}`;
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
      if (theirCashMinLbl) theirCashMinLbl.innerText = `$${theirMin}`;
      if (theirCashMaxLbl) theirCashMaxLbl.innerText = `$${theirMax}`;
      if (theirCashDisplay) theirCashDisplay.innerText = `$${theirInitialVal}`;
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
    const offerCash = parseInt(document.getElementById('trade-my-cash').value, 10) || 0;
    const requestCash = parseInt(document.getElementById('trade-their-cash').value, 10) || 0;

    if (this.negotiatingTradeId) {
      this.sendAction({
        action: 'NEGOTIATE_TRADE',
        tradeId: this.negotiatingTradeId,
        offer: {
          cash: offerCash,
          properties: Array.from(this.tradeOfferProperties)
        },
        request: {
          cash: requestCash,
          properties: Array.from(this.tradeRequestProperties)
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
          properties: Array.from(this.tradeOfferProperties)
        },
        request: {
          cash: requestCash,
          properties: Array.from(this.tradeRequestProperties)
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

  // ================= Live Chat System =================
  sendChatMessage(context = 'game') {
    const inputId = context === 'lobby' ? 'lobby-chat-input' : 'chat-input';
    const input = document.getElementById(inputId);
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    this.sendAction({
      action: 'SEND_CHAT',
      text: text
    });

    input.value = '';
    input.focus();
  }

  renderChatMessages() {
    if (!this.gameState) return;
    const messages = this.gameState.chat_messages || [];

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
              <span style="font-size:0.68rem;color:var(--text-dim);">${trade.resolved_at ? new Date(trade.resolved_at * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
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
          ${canBid ? `
            <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);margin-top:6px;">Quick Bid:</div>
            <div class="auction-quick-bids">
              <button class="btn-primary" onclick="game.placeAuctionBid(${(auction.highest_bid || 0) + 10})">+$10</button>
              <button class="btn-primary" onclick="game.placeAuctionBid(${(auction.highest_bid || 0) + 50})">+$50</button>
              <button class="btn-primary" onclick="game.placeAuctionBid(${(auction.highest_bid || 0) + 100})">+$100</button>
            </div>
            <div style="margin-top:8px;">
              <button class="btn-secondary" style="width:100%;color:#ef4444;" onclick="game.passAuctionBid()">✋ Pass</button>
            </div>
          ` : `
            <div class="spectator-deal-pill">
              ${hasPassed ? 'You passed on this auction' : (this.isSpectator ? 'Spectating live auction' : 'Cannot bid')}
            </div>
          `}
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
              <span style="font-size:0.68rem;color:var(--text-dim);">${item.time ? new Date(item.time * 1000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ''}</span>
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
    this.sendAction({
      action: 'PLACE_BID',
      amount: amount
    });
  }

  passAuctionBid() {
    this.sendAction({
      action: 'PASS_BID'
    });
  }

  // ================= Flying Cash Delta Animation =================
  triggerCashDeltaAnimation(player, diff) {
    if (diff === 0) return;
    const isProfit = diff > 0;
    const text = isProfit ? `+${diff}` : `${diff}`;
    const cssClass = isProfit ? 'profit' : 'loss';

    // Directly where the player balance is written in the sidebar (#player-cash-${p.id})
    const cashEl = document.getElementById(`player-cash-${player.id}`);
    if (cashEl) {
      const fly = document.createElement('span');
      fly.className = `flying-cash-delta ${cssClass}`;
      fly.innerText = text;
      cashEl.appendChild(fly);
      setTimeout(() => fly.remove(), 2000);
    }
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
                <span style="font-size:1.2rem;">${p.avatar}</span>
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
document.addEventListener('DOMContentLoaded', () => {
  window.game.init();
});
