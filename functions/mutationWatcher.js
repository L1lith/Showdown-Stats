import onMutationRecord from './onMutationRecord'

function mutationWatcher(records) {
  records.forEach(record => onMutationRecord(record))
}

export default mutationWatcher
