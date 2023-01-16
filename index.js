'use strict';
const XLSX = require('xlsx');
const FS = require('fs/promises');

const readArchive = async () => {
    var workbook = await XLSX.readFile('EV-19.xlsx'); //READ THE ARCHIVE IN THE ROOT DIRECTORY
    var sheet_name_list = workbook.SheetNames;
    const DATA = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    writteMigration(DATA);
};

const writteMigration = async (DATA) => {
    try {
        var content = "";
        DATA.forEach(element => {
          /*let codigo_intermediario = 0;
          if(element.CODIGO_INTERMEDIARIO && element.CODIGO_INTERMEDIARIO != "") {
            if(element.CODIGO_INTERMEDIARIO == 'SU0') {
              codigo_intermediario = 1000;
            } else {
              codigo_intermediario = Number(element.CODIGO_INTERMEDIARIO);
            }
          } else {
            codigo_intermediario = 1000;
          }*/
            content += `INSERT INTO modyo.aplicacion 
              (codigo_aplicacion, tipo_aplicacion, url, nivel, codigo_padre, componente, titulo, descripcion_aplicacion, activa)
            VALUES 
              (${element.CODIGO_APLICACION}, '${element.TIPO_APLICACION}', '${element.URL}', '${element.NIVEL}',  '${element.CODIGO_PADRE}', null, '${element.TITULO}', null, true)
            ON CONFLICT
              (codigo_aplicacion) 
            DO UPDATE
            SET
            activa = EXCLUDED.activa;\n\n`;            
        });                                
        //console.log(content);
        //console.log("CODIGO PERFIL", ('SU0') ?1:3);
        await FS.writeFile('C:/Users/Q-USER/Documents/Repositorios github/Repositorio G-LAB/migracion_users_sbs/migracion_aplicacion_sbs.txt', content);
    } catch (err) {
        console.log(err);
    }
}

readArchive();