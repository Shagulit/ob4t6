const log = [];

function rollDice(button, count) {
  if (!button.dataset.original) {
    button.dataset.original = button.textContent;
  }
  if (button.textContent.match(/^\d+$/)) {
    // Reset button to its original label
    button.textContent = button.dataset.original;
  } else {
    // Calculate and display the roll result
    const result = calculateExplodingRoll(count);
    button.textContent = result.total;
    log.push(result.details); // Add detailed roll to log
  }
}

function calculateExplodingRoll(count) {
  let total = 0;
  let details = `${count}t6: `; // Start log details with roll type
  for (let i = 0; i < count; i++) {
    let roll = Math.floor(Math.random() * 6) + 1;
    details += `${roll} `;
    if (roll === 6) {
      const explosion = calculateExplodingRoll(2); // Add 2t6 on explosion
      total += explosion.total;
      details += `(+${explosion.details}) `;
    } else {
      total += roll;
    }
  }
  return { total, details };
}

function toggleLog() {
  const logOutput = document.getElementById("logOutput");
  logOutput.style.display = logOutput.style.display === 'none' ? 'block' : 'none';
  logOutput.innerHTML = log.join('<br>');
}
