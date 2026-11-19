// Validasi judul to-do: tidak kosong, maksimal 100 karakter.
function validateTitle(title) {
  if (typeof title !== 'string') return { ok: false, error: 'Judul harus berupa teks' };
  const clean = title.trim();
  if (clean.length === 0) return { ok: false, error: 'Judul tidak boleh kosong' };
  if (clean.length > 100) return { ok: false, error: 'Judul maksimal 100 karakter' };
  return { ok: true, value: clean };
}
module.exports = { validateTitle };
