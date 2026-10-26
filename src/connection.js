export function createConnectionSentence(goal, task) {
  const cleanGoal = goal.trim();
  const cleanTask = task.trim();

  if (!cleanGoal || !cleanTask) {
    return '';
  }

  return `I chose “${cleanTask}” because it can help me make progress toward “${cleanGoal}.”`;
}
