import dayjs from "dayjs";

class Task {
  constructor(
    id,
    description,
    isImportant = false,
    isPrivate = true,
    deadline = false,
    user = 1
  ) {
    this.id = id;
    this.description = description;
    this.important = isImportant;
    this.private = isPrivate;
    this.completed = false;
    this.user = user;
    // saved as dayjs object
    if (deadline !== false && deadline !== "") {
      this.deadline = dayjs(deadline);
    }
  }

  _formatDeadline = (format) => {
    return this.deadline ? this.deadline.format(format) : "<not defined>";
  };

  //Filters
  isImportant = () => {
    return this.important;
  };

  isPrivate = () => {
    return this.private;
  };

  isToday = () => {
    const comparisonTemplate = "YYYY-MM-DD";
    const now = dayjs();
    return (
      this.deadline &&
      this.deadline.format(comparisonTemplate) ===
        now.format(comparisonTemplate)
    );
  };

  isYesterday = () => {
    const comparisonTemplate = "YYYY-MM-DD";
    const yesterday = dayjs().subtract(1, "day");
    return (
      this.deadline &&
      this.deadline.format(comparisonTemplate) ===
        yesterday.format(comparisonTemplate)
    );
  };

  isTomorrow = () => {
    const comparisonTemplate = "YYYY-MM-DD";
    const tomorrow = dayjs().add(1, "day");
    return (
      this.deadline &&
      this.deadline.format(comparisonTemplate) ===
        tomorrow.format(comparisonTemplate)
    );
  };

  isNextWeek = () => {
    const tomorrow = dayjs().add(1, "day");
    const nextWeek = dayjs().add(7, "day");
    const ret =
      this.deadline &&
      !this.deadline.isBefore(tomorrow, "day") &&
      !this.deadline.isAfter(nextWeek, "day");
    return ret;
  };

  setDone = (done) => {
    this.completed = done;
  };
}

function List() {
  this.list = [];
  this.count = 0;

  this.createElement = (description, isUrgent, isPrivate, deadline) => {
    const task = new Task(
      this.count,
      description,
      isUrgent,
      isPrivate,
      deadline
    );
    this.count++;
    this.add(task);
    return this;
  };

  this.add = (task) => {
    if (!this.list.some((t) => t.id === task.id))
      this.list = [...this.list, task];
    else throw new Error("Duplicate id");
  };

  this.remove = (task) => {
    this.list = this.list.filter((t) => t.id !== task.id);
  };

  this.getList = () => this.list.filter((t) => true);
}

export { Task, List };
