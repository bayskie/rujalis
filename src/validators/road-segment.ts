import { z } from "zod";

export const roadSegmentFormSchema = z.object({
  paths: z
    .string({
      required_error: "Ruas jalan wajib diisi",
      invalid_type_error: "Ruas jalan wajib berupa kode ruas",
    })
    .min(1, "Ruas jalan wajib diisi"),
  kode_ruas: z
    .string({
      required_error: "Kode ruas wajib diisi",
      invalid_type_error: "Kode ruas wajib berupa teks",
    })
    .min(1, "Kode ruas wajib diisi"),
  nama_ruas: z
    .string({
      required_error: "Nama ruas wajib diisi",
      invalid_type_error: "Nama ruas wajib berupa teks",
    })
    .min(1, "Nama ruas wajib diisi")
    .max(100, "Nama ruas tidak boleh lebih dari 100 karakter"),
  keterangan: z
    .string({
      required_error: "Keterangan wajib diisi",
      invalid_type_error: "Keterangan wajib berupa teks",
    })
    .min(1, "Keterangan wajib diisi")
    .max(100, "Keterangan tidak boleh lebih dari 100 karakter"),
  panjang: z.coerce
    .number({
      required_error: "Panjang wajib diisi",
      invalid_type_error: "Panjang wajib berupa angka",
    })
    .min(0, "Panjang tidak boleh negatif"),
  lebar: z.coerce
    .number({
      required_error: "Lebar wajib diisi",
      invalid_type_error: "Lebar wajib berupa angka",
    })
    .min(0, "Lebar tidak boleh negatif"),
  desa_id: z
    .string({
      required_error: "Desa wajib diisi",
      invalid_type_error: "Desa wajib diisi",
    })
    .regex(/^[0-9]+$/, "Desa wajib diisi"),
  eksisting_id: z
    .string({
      required_error: "Material wajib diisi",
      invalid_type_error: "Material wajib diisi",
    })
    .regex(/^[0-9]+$/, "Material wajib diisi"),
  kondisi_id: z
    .string({
      required_error: "Kondisi wajib diisi",
      invalid_type_error: "Kondisi wajib diisi",
    })
    .regex(/^[0-9]+$/, "Kondisi wajib diisi"),
  jenisjalan_id: z
    .string({
      required_error: "Jenis wajib diisi",
      invalid_type_error: "Jenis wajib diisi",
    })
    .regex(/^[0-9]+$/, "Jenis wajib diisi"),
});
