

import { TaskItem } from "./TaskItem.js";

const STORAGE_KEY = "dashboard_mahasiswa_124140128";
const SAMPLE_TASKS = [
  {
    title: "Membuat aplikasi daftar tugas dengan HTML, CSS, dan JavaScript",
    category: "Pemrograman Web",
    priority: "tinggi",
    notes: "Buat form tambah tugas, daftar tugas, dan fitur ubah status selesai."
  },
  {
    title: "Mengimplementasikan linked list dan operasi dasarnya",
    category: "Struktur Data",
    priority: "sedang",
    notes: "Implementasikan tambah node, hapus node, dan pencarian data."
  },
  {
    title: "Merancang ERD dan query SQL untuk sistem perpustakaan",
    category: "Basis Data",
    priority: "rendah",
    notes: "Tentukan entitas, relasi, primary key, foreign key, dan query laporan peminjaman."
  },
  {
    title: "Menganalisis kompleksitas algoritma sorting",
    category: "Algoritma dan Pemrograman",
    priority: "sedang",
    notes: "Bandingkan Bubble Sort, Insertion Sort, dan Merge Sort menggunakan notasi Big-O."
  }
];

// Mengelola koleksi tugas dan menyimpannya sebagai data serializable di localStorage.
export class DashboardApp {
  constructor() {
    this.tasks = this.load();
    this.statusFilter = "all";
    this.categoryFilter = "all";
    this.priorityFilter = "all";
    this.searchQuery = "";
    this.sortBy = "deadline";
  }

  load = () => {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (!rawData) return [];
      const parsed = JSON.parse(rawData);
      if (!Array.isArray(parsed)) return [];

      let legacySeedIndex = 0;
      // Ganti judul acak seed lama, tetapi pertahankan status dan deadline pengguna.
      return parsed.map(item => {
        if (String(item.id).startsWith("seed_")) {
          const sample = SAMPLE_TASKS[legacySeedIndex % SAMPLE_TASKS.length];
          legacySeedIndex += 1;
          return new TaskItem({ ...item, ...sample });
        }
        return new TaskItem(item);
      });
    } catch (error) {
      console.error("Gagal membaca localStorage:", error);
      return [];
    }
  };

  save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
    } catch (error) {
      console.error("Gagal menyimpan ke localStorage:", error);
    }
  };

  addTask = ({ title, category = "Umum", priority = "sedang", dueDate = "", notes = "" }) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      throw new Error("Judul tugas tidak boleh kosong.");
    }

    const newTask = new TaskItem({
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: trimmedTitle,
      category: category.trim() || "Umum",
      priority,
      dueDate,
      notes: notes.trim(),
      done: false,
      createdAt: new Date().toISOString()
    });

    this.tasks = [newTask, ...this.tasks];
    this.save();
    return newTask;
  };

  updateTask = (id, changes = {}) => {
    // Buat array dan item baru agar pembaruan state tetap immutable.
    this.tasks = this.tasks.map(task => {
      if (task.id === id) {
        return new TaskItem({
          ...task,
          ...changes
        });
      }
      return task;
    });
    this.save();
  };

  toggleTask = (id) => {
    this.tasks = this.tasks.map(task => {
      if (task.id === id) {
        const updated = new TaskItem({ ...task });
        updated.toggleDone();
        return updated;
      }
      return task;
    });
    this.save();
  };

  deleteTask = (id) => {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.save();
  };

  clearCompleted = () => {
    const initialCount = this.tasks.length;
    this.tasks = this.tasks.filter(task => !task.done);
    this.save();
    return initialCount - this.tasks.length;
  };

  getTaskById = (id) => {
    return this.tasks.find(task => task.id === id) || null;
  };

  getCategories = () => {
    const categories = this.tasks.map(t => t.category).filter(Boolean);
    return ["all", ...new Set(categories)];
  };

  getStatistics = () => {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.done).length;
    const active = total - completed;
    const highPriority = this.tasks.filter(t => !t.done && t.priority === "tinggi").length;
    const overdue = this.tasks.filter(t => t.isOverdue()).length;

    return { total, active, completed, highPriority, overdue };
  };

  getFilteredTasks = () => {
    const query = this.searchQuery.trim().toLowerCase();

    const filtered = this.tasks.filter(task => {
      const matchStatus =
        this.statusFilter === "all" ? true :
        this.statusFilter === "active" ? !task.done :
        task.done;

      const matchCategory =
        this.categoryFilter === "all" || task.category === this.categoryFilter;

      const matchPriority =
        this.priorityFilter === "all" || task.priority === this.priorityFilter;

      const matchSearch =
        query === "" ||
        task.title.toLowerCase().includes(query) ||
        task.notes.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query);

      return matchStatus && matchCategory && matchPriority && matchSearch;
    });

    const priorityWeight = { tinggi: 3, sedang: 2, rendah: 1 };

    return [...filtered].sort((a, b) => {
      if (this.sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (this.sortBy === "priority") {
        return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
      }
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  };

  seedSampleTasks = () => {
    const today = new Date();

    const seededTasks = SAMPLE_TASKS.map((sample, index) => {
      const due = new Date(today);
      due.setDate(today.getDate() + (index + 1));
      const dueDateStr = due.toISOString().split("T")[0];

      return new TaskItem({
        id: `sample_${Date.now()}_${index}`,
        ...sample,
        dueDate: dueDateStr,
        done: index === SAMPLE_TASKS.length - 1,
        createdAt: new Date().toISOString()
      });
    });

    this.tasks = [...seededTasks, ...this.tasks];
    this.save();
    return seededTasks.length;
  };
}
