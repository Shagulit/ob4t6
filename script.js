const log = [];

function rollDice(button, count) {
  if (!button.dataset.original) {
    button.dataset.original = button.textContent;
  }
  if (button.textContent.match(/^\d+$/)) {
    // Reset button to original label
    button.textContent = button.dataset.original;
    button.classList.remove("number");
  } else {
    // Calculate and display the roll result
    const result = calculateExplodingRoll(count);
    button.textContent = result.total;
    button.classList.add("number");
    log.push(result.details);
    updateLog();
  }
}


function calculateExplodingRoll(count, suppressLog = false) {
  let total = 0;
  let details = "";

  for (let i = 0; i < count; i++) {
    let roll = Math.floor(Math.random() * 6) + 1;
    total += roll;

    // Format roll and explosion details
    if (roll === 6) {
      const explosion = calculateExplodingRoll(2, suppressLog);
      total += explosion.total;

      // Explosion format: (6-->Ob2t6=<explosion total>=<explosion details>)
      if (!suppressLog) {
        details += `(6-->Ob2t6=${explosion.total}=${explosion.details.trim()}) + `;
      }
    } else {
      // Add non-explosion roll to details
      if (!suppressLog) {
        details += `${roll} + `;
      }
    }
  }

  // Remove trailing "+ " from details and add final formatting
  if (!suppressLog) {
    details = details.trim().replace(/\+ $/, ""); // Trim final "+ "
    details = `Ob${count}t6=${total}: ${details}`;
  }

  return suppressLog ? { total } : { total, details };
}



function toggleLog() {
  const logOutput = document.getElementById("logOutput");
  logOutput.style.display = logOutput.style.display === 'none' ? 'block' : 'none';
  updateLog();
}

function updateLog() {
  const logOutput = document.getElementById("logOutput");
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
