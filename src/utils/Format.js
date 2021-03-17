export class Format {
  static getCamelCase(text) {
    let div = document.createElement("div");
    div.innerHTML = `<div data-${text} id=""></div>`;
    return Object.keys(div.firstChild.dataset)[0];
  }

  static loadElements(controller) {
    controller.el = {};

    document.querySelectorAll("[id]").forEach((element) => {
      controller.el[this.getCamelCase(element.id)] = element;
    });
  }
}
