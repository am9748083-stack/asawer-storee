
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uicmaxevvdurkjxjkoom.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpY21heGV2dmR1cmtqeGprb29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMTExMDAsImV4cCI6MjA4Njc4NzEwMH0.zzVH5FOUyqrRb5ntJ7d4Zj6hpkGcOY7r8ID0B9sRcgw'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadImage = async (file: File) => {
  try {
    // استخدام اسم ملف فريد جداً باستخدام الوقت الحالي
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // تفعيل التحديث في حال وجود ملف بنفس الاسم
      });

    if (uploadError) {
      console.error('Storage Upload Error:', uploadError);
      throw new Error(`فشل رفع الصورة: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('assets')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error: any) {
    console.error('Error in uploadImage helper:', error);
    throw error;
  }
};
