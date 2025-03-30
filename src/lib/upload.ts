
import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImage(file: File): Promise<{ url: string | null; error: Error | null }> {
  try {
    if (!file) {
      return { url: null, error: new Error('No file provided') };
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('service-images')
      .upload(filePath, file);
      
    if (uploadError) {
      throw uploadError;
    }
    
    const { data } = supabase.storage
      .from('service-images')
      .getPublicUrl(filePath);
      
    return { url: data.publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { url: null, error: error as Error };
  }
}
