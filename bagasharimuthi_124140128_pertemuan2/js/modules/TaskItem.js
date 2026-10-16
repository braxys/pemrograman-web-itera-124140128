

// Model tugas menyatukan data dan perilaku yang dipakai saat merender deadline.
export class TaskItem {
  constructor({
    id = Date.now().toString(),
    title = "",
    category = "Umum",
    priority = "sedang",
    dueDate = "",
    notes = "",
    done = false,
    createdAt = new Date().toISOString()
  } = {}) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.priority = priority;
    this.dueDate = dueDate;
    this.notes = notes;
    this.done = Boolean(done);
    this.createdAt = createdAt;
  }

  toggleDone = () => {
    this.done = !this.done;
  };

  isOverdue = () => {
    if (!this.dueDate || this.done) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(this.dueDate);
    return targetDate < today;
  };

  getDeadlineStatus = () => {
    if (!this.dueDate) return { label: "Tanpa deadline", status: "none" };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(this.dueDate);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (this.done) {
      return { label: "Selesai", status: "completed" };
    }
    if (diffDays < 0) {
      return { label: `Terlambat ${Math.abs(diffDays)} hari`, status: "danger" };
    }
    if (diffDays === 0) {
      return { label: "Hari ini!", status: "warning" };
    }
    if (diffDays === 1) {
      return { label: "Besok", status: "warning" };
    }
    return { label: `${diffDays} hari lagi`, status: "normal" };
  };
}
