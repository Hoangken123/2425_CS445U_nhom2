exports.up = function (knex) {
  return knex.schema.createTable("chi_tiet_nhap_khos", (table) => {
    table.increments("id").primary();
    table.integer("id_phieu_nhap_kho").unsigned().notNullable();
    table.integer("id_san_pham").unsigned().notNullable();
    table.integer("so_luong").notNullable();
    table.decimal("don_gia_nhap", 10, 2).notNullable();
    table.decimal("thanh_tien", 10, 2).notNullable();
    table.integer("id_cua_hang").unsigned().notNullable();
    table.integer("id_user").unsigned().notNullable();
    table.text("ghi_chu");
    table.timestamp("ngay_nhap").defaultTo(knex.fn.now());
    table.timestamps(true, true);

    table.foreign("id_phieu_nhap_kho").references("don_nhaps.id").onDelete("CASCADE");
    table.foreign("id_san_pham").references("san_phams.id").onDelete("CASCADE");
    table.foreign("id_cua_hang").references("cua_hangs.id").onDelete("CASCADE");
    table.foreign("id_user").references("users.id").onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("chi_tiet_nhap_khos");
};
