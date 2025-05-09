import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://jlggruubpbywznhdziqc.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsZ2dydXVicGJ5d3puaGR6aXFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDIzMDY2OSwiZXhwIjoyMDU5ODA2NjY5fQ.0kXwCKfbJMKJQC9mifwRh1bzV04Kl6NmsUThB2R8xRw';
export const supabase = createClient(supabaseUrl, supabaseKey);
