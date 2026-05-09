/**
 * Utility to handle application data export and import (Backup/Restore).
 */

const STORAGE_KEYS = [
  "holy-bible-storage",
  "holy-bible-custom-canon-v2",
  "theme"
];

export const exportData = () => {
  try {
    const backupData: Record<string, string | null> = {};
    
    STORAGE_KEYS.forEach(key => {
      backupData[key] = localStorage.getItem(key);
    });

    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement("a");
    link.href = url;
    const date = new Date().toISOString().split('T')[0];
    link.download = `holy-bible-backup-${date}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error("Export failed:", error);
    return false;
  }
};

export const importData = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Basic validation
        if (!data || typeof data !== "object") {
          throw new Error("Invalid backup format");
        }

        // Apply data to localStorage
        Object.entries(data).forEach(([key, value]) => {
          if (STORAGE_KEYS.includes(key) && typeof value === "string") {
            localStorage.setItem(key, value);
          }
        });

        resolve(true);
      } catch (error) {
        console.error("Import failed:", error);
        resolve(false);
      }
    };
    
    reader.onerror = () => resolve(false);
    reader.readAsText(file);
  });
};
