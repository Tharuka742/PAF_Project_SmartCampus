function PriorityBadge({ priority }) {
  return (
    <span className={`priority-badge priority-${priority?.toLowerCase()}`}>
      {priority}
    </span>
  );
}

export default PriorityBadge;