function onMutationRecord(mutationRecord) {
  Array.from(mutationRecord.addedNodes).filter(node => node.className && node.className.includes('statbar')).forEach(statbar => {
    setupStatbar(statbar)
  })
}

export default onMutationRecord
