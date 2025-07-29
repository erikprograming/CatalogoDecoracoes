function formatarNome(nome) {
    let semExt = nome.replace(/\.[^/.]+$/, '');
    let comEspacos = semExt.replace(/([A-Z])/g, ' $1').trim();
    return comEspacos
        .split(' ')
        .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join(' ');
}

function tentarCarregarImagem(img, url, tentativas = 10) {
    img.onerror = () => {
        if (tentativas > 0) {
            setTimeout(() => {
                img.src = url + "?t=" + new Date().getTime(); // força recarregar
                tentarCarregarImagem(img, url, tentativas - 1);
            }, 1000);
        } else {
            img.src = 'https://via.placeholder.com/200x200?text=Erro+na+Imagem';
        }
    };
}

fetch('https://api.github.com/repos/erikprograming/CatalogoDecoracoes/contents/Imagens/Totens')
    .then(res => res.json())
    .then(arquivos => {
        let i = 0;

        function carregarProxima() {
            if (i >= arquivos.length) return;

            const arq = arquivos[i];
            const div = document.createElement('div');
            div.className = 'unid';

            const img = document.createElement('img');
            img.alt = arq.name;
            img.loading = "lazy";
            img.src = arq.download_url;

            tentarCarregarImagem(img, arq.download_url);

            const p = document.createElement('p');
            p.textContent = formatarNome(arq.name);

            div.appendChild(img);
            div.appendChild(p);
            document.getElementById('galeria').appendChild(div);

            i++;
            setTimeout(carregarProxima, 100); // delay de 200ms entre cada imagem
        }

        carregarProxima();
    })
    .catch(err => {
        console.error("Erro ao carregar imagens:", err);
    });
