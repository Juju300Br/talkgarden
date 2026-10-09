<?php
// =====================================================================
// rodape.php
// Fecha o que foi aberto no topo.php e carrega o JavaScript.
// Se a página tiver um script próprio, defina antes de incluir:
//     $script_pagina = 'js/vocabulario.js';
// Ele é carregado DEPOIS do geral.js, para poder usar as funções dele.
// =====================================================================
?>
        </main>
    </div><!-- fim da .area-principal -->
</div><!-- fim do .layout -->

<script src="js/geral.js"></script>
<?php if (isset($script_pagina)) { ?>
    <script src="<?php echo $script_pagina; ?>"></script>
<?php } ?>
</body>
</html>
