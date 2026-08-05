fetch('./data/bio.yaml')
  .then((response) => response.text())
  .then((text) => {
    const data = jsyaml.load(text);
    // console.log(data);
    // console.log(data.bio);
    // console.log(data.bio.nombre);
    console.log(data.bio.estudios);

    // document.body.innerHTML += `<h1>${data.title}</h1>`;

    data.bio.estudios.forEach((item) => {
      console.log(item);
      //   //   document.body.innerHTML += `<p>${item.name} (${item.type})</p>`;
    });
  });
