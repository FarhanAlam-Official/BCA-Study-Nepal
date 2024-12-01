export const safeRequest = async <T>(requestFn: () => Promise<any>): Promise<T> => {
    try {
      const response = await requestFn();
      return response.data;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  };
  
  export const handleFileDownload = async (fileUrl: string): Promise<void> => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileUrl.split('/').pop() || 'download');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  };