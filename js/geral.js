// =====================================================================
// geral.js
// Funções usadas em várias páginas do TalkGarden.
// =====================================================================

// Mostra ou esconde a senha quando a pessoa clica no "olhinho".
// idCampo = o id do <input> da senha (ex.: "senha").
function mostrarSenha(idCampo) {
    let campo = document.getElementById(idCampo);

    // Se está escondida (password), mostra (text). Se está aparecendo, esconde.
    if (campo.type == 'password') {
        campo.type = 'text';
    } else {
        campo.type = 'password';
    }
}
