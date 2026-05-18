/* ============================================================
   ROLAND GARRULOS — App JS
   Navegación entre pantallas + render de datos
   ============================================================ */

(function() {
  const T = window.TOURNAMENT;
  const { getPlayer, fullName, shortName, pairName, pairShort } = window;

  // ---------- Navigation ----------
  const screens = document.querySelectorAll(".screen");
  const navLinks = document.querySelectorAll("[data-screen]");
  const brand = document.querySelector(".brand");

  function goScreen(id) {
    screens.forEach(s => s.classList.toggle("active", s.id === id));
    navLinks.forEach(a => {
      const screen = a.dataset.screen;
      // Mark active for main nav of this section family
      const isActive =
        screen === id ||
        (id.startsWith("admin") && screen === "admin");
      a.classList.toggle("active", isActive);
    });
    // Update hash without scrolling
    if (history.replaceState) {
      history.replaceState(null, "", "#" + id);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  window.goScreen = goScreen;

  navLinks.forEach(a => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      goScreen(a.dataset.screen);
    });
  });
  brand.addEventListener("click", () => goScreen("home"));

  // Initial from hash
  const initialHash = location.hash.replace("#", "");
  if (initialHash && document.getElementById(initialHash)) {
    goScreen(initialHash);
  }

  // ---------- Helpers ----------
  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  // ---------- Home: match list ----------
  const matchList = document.getElementById("match-list");
  T.upcoming.forEach((m, i) => {
    const isLive = m.live;
    const p1Names = m.pair1.players.map(shortName).join(" / ");
    const p2Names = m.pair2.players.map(p => p === "?" ? "Por definir" : shortName(p)).join(" / ");
    matchList.appendChild(el(`
      <div class="match-row ${isLive ? "live" : ""}">
        <div class="time">${m.time}</div>
        <div class="team"><div class="name">${p1Names}</div></div>
        <div class="vs">${isLive ? "EN JUEGO" : "VS"}</div>
        <div class="team right"><div class="name">${p2Names}</div></div>
        <div class="court">${m.court}</div>
      </div>
    `));
  });

  // ---------- Grupos: standings ----------
  const groupsGrid = document.getElementById("groups-grid");
  ["A","B","C","D"].forEach(g => {
    const rows = T.standings[g].map((r, idx) => {
      const p = getPlayer(r.id);
      const qual = idx < 2;
      return `
        <tr class="${qual ? "qualified" : ""} ${idx === 1 ? "last" : ""}">
          <td class="player"><span class="pos">${idx+1}</span> ${p.name} ${p.surname}
            <div style="font-family: var(--f-mono); font-size:10px; color: var(--ink-3); margin-top:2px;">${p.nick}</div>
          </td>
          <td class="num hide-sm">${r.pj}</td>
          <td class="num">${r.pg}</td>
          <td class="num hide-sm">${r.jf}/${r.jc}</td>
          <td class="num pts">${r.pts}</td>
        </tr>
      `;
    }).join("");

    groupsGrid.appendChild(el(`
      <div class="group">
        <div class="group-head">
          <h3>Grupo ${g}</h3>
          <div class="subhead">4 jugadores · 3 rondas</div>
        </div>
        <table class="standings">
          <thead>
            <tr>
              <th>Jugador</th>
              <th class="hide-sm" style="text-align:center;">PJ</th>
              <th style="text-align:center;">PG</th>
              <th class="hide-sm" style="text-align:center;">JF/JC</th>
              <th style="text-align:center;">PTS</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `));
  });

  // ---------- Rotaciones americano Grupo A ----------
  const rotMatches = document.getElementById("rotation-matches");
  const round1 = T.rotations.A[0];
  function renderRotation(round) {
    rotMatches.innerHTML = "";
    round.matches.forEach(m => {
      const p1 = pairShort(m.pair1);
      const p2 = pairShort(m.pair2);
      const scoreClass = m.score ? "" : "unplayed";
      const scoreText = m.score || "—";
      rotMatches.appendChild(el(`
        <div class="rmatch ${scoreClass}">
          <div class="pair"><small>Pareja A</small>${p1}</div>
          <div class="score">${scoreText}</div>
          <div class="pair right"><small>Pareja B</small>${p2}</div>
        </div>
      `));
    });
  }
  renderRotation(round1);

  document.querySelectorAll(".rotation-tab").forEach((tab, i) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".rotation-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      if (i < 3) renderRotation(T.rotations.A[i]);
    });
  });

  // ---------- Bracket ----------
  const bracketEl = document.getElementById("bracket");
  const B = T.bracket;

  function renderBmatch(match, opts = {}) {
    const { isFinal, isCurrent } = opts;
    const w = match.winner;
    const p1 = match.pair1;
    const p2 = match.pair2;
    const sets = match.sets || [];

    function teamRow(pair, key) {
      const isWinner = w === key;
      const isLoser = w && !isWinner;
      const cls = isWinner ? "winner" : (isLoser ? "loser" : "");
      const names = pair.players.map(id => id === "?" ? "Por definir" : shortName(id));
      const label = pair.label || `Pos. ${pair.fromGroup || ""}`;
      const setsHtml = (sets.length > 0)
        ? sets.map(s => s.split("-")[isWinner ? 0 : (w ? 1 : (key === "pair1" ? 0 : 1))]).map(n => `<span>${n}</span>`).join("")
        : `<span class="muted">—</span>`;
      return `
        <div class="bteam ${cls}">
          <div class="pair">
            <small>${pair.fromGroup ? "Grupo " + pair.fromGroup : ""}</small>
            ${names.join(" / ")}
          </div>
          <div class="sets">${setsHtml}</div>
        </div>
      `;
    }

    return `
      <div class="bmatch ${isFinal ? "final" : ""}">
        ${teamRow(p1, "pair1")}
        ${teamRow(p2, "pair2")}
      </div>
    `;
  }

  // Columnas del bracket
  bracketEl.innerHTML = `
    <div class="bracket-col">
      <div class="bracket-col-head">Cuartos · 4 partidos</div>
      ${renderBmatch(B.quarters[0])}
      ${renderBmatch(B.quarters[1])}
    </div>
    <div class="bracket-col">
      <div class="bracket-col-head">Semifinales</div>
      ${renderBmatch(B.semis[0])}
      ${renderBmatch(B.semis[1], { isCurrent: true })}
    </div>
    <div class="bracket-col">
      <div class="bracket-col-head">Final · 21:30h</div>
      ${renderBmatch({ pair1: B.final.pair1, pair2: { players:["?","?"], fromGroup:"" }, sets:[], winner:null }, { isFinal: true })}
      <div class="muted mono" style="font-size:11px; text-align:center; margin-top:8px;">Esperando ganador SF2 →</div>
    </div>
    <div class="bracket-col">
      <div class="bracket-col-head">Campeón/a</div>
      <div class="trophy-card">
        <div class="crown">🏆</div>
        <div class="champ-label">A determinar</div>
        <div class="champ-name">¿Quién levantará la<br/>copa Garrulos?</div>
      </div>
    </div>
  `;

  // ---------- Perfil: historial ----------
  const ph = document.getElementById("player-history");
  T.playerHistory[2].forEach(m => {
    const isWin = m.result === "W";
    const isPending = m.result === "·";
    const partner = fullName(m.partner);
    const vs = m.vs.map(id => id === "?" ? "?" : shortName(id)).join(" / ");
    const badgeClass = isPending ? "" : (isWin ? "win" : "loss");
    const badgeText = isPending ? "·" : m.result;
    ph.appendChild(el(`
      <div class="history-row">
        <div class="badge ${badgeClass}" ${isPending ? 'style="background: var(--cream-2); color: var(--ink-3);"' : ""}>${badgeText}</div>
        <div class="partner"><small>${m.round}</small><b>+ ${partner}</b></div>
        <div class="vs"><small>vs</small>${vs}</div>
        <div class="when score-cell">${m.score}</div>
      </div>
    `));
  });

  // ---------- Admin: tabla jugadores ----------
  const adminBody = document.getElementById("admin-players-body");
  T.players.forEach((p, idx) => {
    const initials = (p.name[0] + p.surname[0]).toUpperCase();
    adminBody.appendChild(el(`
      <tr>
        <td class="mono muted">${String(idx+1).padStart(2,"0")}</td>
        <td>
          <div class="player-cell">
            <div class="player-avatar">${initials}</div>
            <div>
              <div style="font-weight:600;">${p.name} ${p.surname}</div>
              <div class="mono muted" style="font-size:11px;">id #${p.id}</div>
            </div>
          </div>
        </td>
        <td class="hide-sm muted">"${p.nick}"</td>
        <td><span class="tag ${p.group === "A" ? "green" : p.group === "B" ? "blue" : p.group === "C" ? "ball" : ""}">Grupo ${p.group}</span></td>
        <td class="hide-sm"><span class="muted" style="font-size:13px;">Activo</span></td>
        <td>
          <div class="actions">
            <button class="icon-btn" title="Editar">✎</button>
            <button class="icon-btn danger" title="Eliminar">🗑</button>
          </div>
        </td>
      </tr>
    `));
  });

  // ---------- Admin: result editor (Grupo A) ----------
  const editorEl = document.getElementById("result-editor");
  const groupA = T.rotations.A;
  groupA.forEach(round => {
    round.matches.forEach(m => {
      const score = m.score ? m.score.split("-") : ["", ""];
      const isSaved = !!m.score;
      editorEl.appendChild(el(`
        <div class="result-row">
          <div class="round-tag">R${round.round}</div>
          <div class="pair">
            <small>Pareja A</small>
            ${pairShort(m.pair1)}
          </div>
          <div class="score-input">
            <input type="number" value="${score[0]}" placeholder="-" />
            <span class="mono muted">:</span>
            <input type="number" value="${score[1]}" placeholder="-" />
          </div>
          <div class="pair right">
            <small>Pareja B</small>
            ${pairShort(m.pair2)}
          </div>
          <div class="saved">${isSaved ? "✓ guardado" : "pendiente"}</div>
        </div>
      `));
    });
  });

  // ---------- Admin: qualifiers + pairings ----------
  const qList = document.getElementById("qualifiers-list");
  const seeded = []; // {playerId, group, position(1 or 2)}
  ["A","B","C","D"].forEach(g => {
    seeded.push({ pid: T.standings[g][0].id, group:g, pos:1, pts: T.standings[g][0].pts });
    seeded.push({ pid: T.standings[g][1].id, group:g, pos:2, pts: T.standings[g][1].pts });
  });
  // Seed = order by pts (just for show), top 8
  const ranked = [...seeded].sort((a,b) => b.pts - a.pts);
  ranked.forEach((q, i) => {
    const p = getPlayer(q.pid);
    qList.appendChild(el(`
      <div class="qual-item">
        <div class="seed">${i+1}</div>
        <div>
          <div style="font-weight:600;">${p.name} ${p.surname}</div>
          <div class="from">${q.pos}º Grupo ${q.group} · ${q.pts} pts</div>
        </div>
        <span class="tag ${q.pos === 1 ? "ball" : ""}">${q.pos === 1 ? "1º" : "2º"}</span>
      </div>
    `));
  });

  // Pairings: 1º grupo + 2º grupo (mismo grupo se emparejan)
  const pairList = document.getElementById("pairings-list");
  const pairings = ["A","B","C","D"].map((g, i) => ({
    n: i+1,
    p1: T.standings[g][0].id,
    p2: T.standings[g][1].id,
    g
  }));
  // Cruces: P1 (A) vs P4 (D) — P2 (B) vs P3 (C)
  const cruces = [
    [pairings[0], pairings[3]],
    [pairings[1], pairings[2]],
  ];
  cruces.forEach((c, i) => {
    const a = c[0], b = c[1];
    const aPlayers = [getPlayer(a.p1), getPlayer(a.p2)];
    const bPlayers = [getPlayer(b.p1), getPlayer(b.p2)];
    pairList.appendChild(el(`
      <div class="pairing">
        <div class="pn">QF${i*2+1}</div>
        <div>
          <strong>${aPlayers[0].surname} / ${aPlayers[1].surname}</strong>
          <span class="muted"> · Grupo ${a.g} </span>
          <span class="muted mono" style="font-size:11px;"> vs </span>
          <strong>${bPlayers[0].surname} / ${bPlayers[1].surname}</strong>
          <span class="muted"> · Grupo ${b.g}</span>
        </div>
      </div>
    `));
    pairList.appendChild(el(`
      <div class="pairing">
        <div class="pn">QF${i*2+2}</div>
        <div>
          <strong>${aPlayers[0].surname} / ${aPlayers[1].surname}</strong>
          <span class="muted"> (intra-grupo ${a.g})</span>
          <span class="muted mono" style="font-size:11px;"> vs </span>
          <strong>${bPlayers[0].surname} / ${bPlayers[1].surname}</strong>
          <span class="muted"> (intra-grupo ${b.g})</span>
        </div>
      </div>
    `));
  });

})();
