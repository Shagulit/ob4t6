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

function calculateExplodingRoll(count, suppressLog = false) {
  let total = 0;
  let details = `${count}t6: `;

  for (let i = 0; i < count; i++) {
    let roll = Math.floor(Math.random() * 6) + 1;
    if (!suppressLog) details += `${roll} `;

    if (roll === 6) {
      const explosion = calculateExplodingRoll(2, suppressLog); // Recursive call with same suppression setting
      total += explosion.total;
      if (!suppressLog) details += `(+${explosion.details}) `;
    } else {
      total += roll;
    }
  }

  return suppressLog ? { total } : { total, details };
}

function toggleLog() {
  const logOutput = document.getElementById("logOutput");
  logOutput.style.display = logOutput.style.display === 'none' ? 'block' : 'none';
  logOutput.innerHTML = log.join('<br>');
}

function estimateMean() {
  const numRolls = 10000;
  let sum = 0;

  for (let i = 0; i < numRolls; i++) {
    sum += calculateExplodingRoll(1, true).total; // Use suppressed log version
  }

  const mean = sum / numRolls;
  document.getElementById("meanResult").textContent = `Estimated E[ob1t6]: ${mean.toFixed(2)}`;
}
