(() => {
  const noBtn = document.getElementById('noBtn');
  const yesBtn = document.getElementById('yesBtn');
  const buttons = document.getElementById('buttons');

  const noMessages = [
    'opps 😅',
    'maybe try again?',
    'hmm?',
    'maybe try the other button?'
  ];
  let lastMsgIndex = -1;

  function rectsOverlap(a, b) {
    return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
  }

  function moveNo() {
    const containerRect = buttons.getBoundingClientRect();
    const noRect = noBtn.getBoundingClientRect();
    const yesRect = yesBtn.getBoundingClientRect();

    const relYes = {
      left: yesRect.left - containerRect.left,
      top: yesRect.top - containerRect.top,
      right: yesRect.right - containerRect.left,
      bottom: yesRect.bottom - containerRect.top
    };

    const maxX = Math.max(0, containerRect.width - noRect.width);
    const maxY = Math.max(0, containerRect.height - noRect.height);
    const padding = 8;

    let attempts = 0;
    let placed = false;
    while (attempts < 40 && !placed) {
      const x = Math.floor(padding + Math.random() * (Math.max(1, maxX - padding * 2)));
      const y = Math.floor(padding + Math.random() * (Math.max(1, maxY - padding * 2)));

      const candidate = { left: x, top: y, right: x + noRect.width, bottom: y + noRect.height };

      if (!rectsOverlap(candidate, relYes)) {
        noBtn.style.left = x + 'px';
        noBtn.style.top = y + 'px';
        placed = true;
        break;
      }
      attempts++;
    }

    if (!placed) {
      const yesCenterX = (relYes.left + relYes.right) / 2;
      const x = yesCenterX < containerRect.width / 2 ? maxX : 0;
      const y = Math.min(maxY, Math.max(0, (containerRect.height - noRect.height) / 2));
      noBtn.style.left = x + 'px';
      noBtn.style.top = y + 'px';
    }
    try {
      let idx = Math.floor(Math.random() * noMessages.length);
      if (idx === lastMsgIndex) idx = (idx + 1) % noMessages.length;
      lastMsgIndex = idx;
      noBtn.innerText = noMessages[idx];
    } catch (e) {}
  }

  let noActivated = false;
  function activateNo(e) {
    if (!noActivated) noActivated = true;
    moveNo();
  }

  noBtn.addEventListener('mouseenter', activateNo);
  noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); activateNo(); }, {passive:false});
  noBtn.addEventListener('click', (e) => { e.preventDefault(); activateNo(); });

  yesBtn.addEventListener('click', () => {
    window.location.href = 'thankyou.html';
  });

  window.addEventListener('resize', () => {
    try {
      const btnRect = noBtn.getBoundingClientRect();
      const containerRect = buttons.getBoundingClientRect();
      const maxX = Math.max(0, containerRect.width - btnRect.width);
      const maxY = Math.max(0, containerRect.height - btnRect.height);
      const curLeft = parseInt(noBtn.style.left || 0, 10);
      const curTop = parseInt(noBtn.style.top || 0, 10);
      if (curLeft > maxX) noBtn.style.left = maxX + 'px';
      if (curTop > maxY) noBtn.style.top = maxY + 'px';
    } catch (e) {}
  });
})();
