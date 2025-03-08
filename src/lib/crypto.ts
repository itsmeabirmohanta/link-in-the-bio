// Simple encryption using base64 and XOR
export function encrypt(text: string, key: string = 'link-in-bio'): string {
  const xor = (str: string, key: string) => {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  };
  
  return btoa(xor(text, key));
}

export function decrypt(encrypted: string, key: string = 'link-in-bio'): string {
  const xor = (str: string, key: string) => {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  };
  
  try {
    return xor(atob(encrypted), key);
  } catch {
    return '';
  }
} 