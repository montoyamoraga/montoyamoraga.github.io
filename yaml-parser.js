fetch('./data/bio.yaml')
  .then((response) => response.text())
  .then((text) => {
    const data = jsyaml.load(text);
    console.log(data);

    // document.body.innerHTML += `<h1>${data.title}</h1>`;

    data.bio.forEach((item) => {
      //   document.body.innerHTML += `<p>${item.name} (${item.type})</p>`;
    });
  });
