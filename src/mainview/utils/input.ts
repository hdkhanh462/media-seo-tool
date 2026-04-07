export const selectFile = (cb: (fileName: string) => void) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".xlsx,.xls";
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      cb(file.name);
    }
  };
  input.click();
};

export const selectFolder = (cb: (folderName: string) => void) => {
  const input = document.createElement("input");
  input.type = "file";
  input.webkitdirectory = true;
  input.onchange = (e) => {
    const files = (e.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const dir = files[0].webkitRelativePath.split("/")[0];
      cb(dir);
    }
  };
  input.click();
};
