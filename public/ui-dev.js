document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".element");
    const canvas = document.getElementById("canvas");
    let selectedElement = null;
    let elementDataArray = [];

    function generateRandomId() {
        return Math.random().toString(36).substring(2, 9);
    }

    elements.forEach(function (element) {
        element.addEventListener("click", function () {
            const elementId = this.id;
            const uniqueID = generateRandomId();

            if (elementId === "label") {
                const label = document.createElement("label");
                label.innerText = "Label";
                label.classList.add("element");
                label.draggable = true;
                canvas.appendChild(label);
                setupElementProperties(label, uniqueID);
            } else if (elementId === "button") {
                const button = document.createElement("button");
                button.innerText = "Button";
                button.classList.add("element");
                button.draggable = true;
                canvas.appendChild(button);
                setupElementProperties(button, uniqueID);
            } else if (elementId === "hyperlink") {
                const hyperlink = document.createElement("a");
                hyperlink.innerText = "Hyperlink";
                hyperlink.classList.add("element");
                hyperlink.href = "#";
                hyperlink.draggable=true;
                canvas.appendChild(hyperlink);
                setupElementProperties(hyperlink, uniqueID);
            }
            const elementData = {
                id: uniqueID,
                type: elementId,
                properties: {}
            };

            elementDataArray.push(elementData);
        });

        // Add 'dragover' event listener to the canvas to allow dropping elements
        canvas.addEventListener("dragover", function (e) {
            e.preventDefault();
            canvas.style.backgroundColor = "lightgray"; // Change canvas background color
        });

        // Add 'dragleave' event listener to reset canvas background color
        canvas.addEventListener("drop", function () {
            canvas.style.backgroundColor = "";
        });
        element.addEventListener("dragstart", function () {
            const elementId = this.id;
            const uniqueID = generateRandomId();

            if (elementId === "label") {
                const label = document.createElement("label");
                label.innerText = "Label";
                label.classList.add("element");
                canvas.appendChild(label);
                setupElementProperties(label, uniqueID);
            } else if (elementId === "button") {
                const button = document.createElement("button");
                button.innerText = "Button";
                button.classList.add("element");
                canvas.appendChild(button);
                setupElementProperties(button, uniqueID);
            } else if (elementId === "hyperlink") {
                const hyperlink = document.createElement("a");
                hyperlink.innerText = "Hyperlink";
                hyperlink.classList.add("element");
                hyperlink.href = "#";
                canvas.appendChild(hyperlink);
                setupElementProperties(hyperlink, uniqueID);
            }
            const elementData = {
                id: uniqueID,
                type: elementId,
                properties: {}
            };

            elementDataArray.push(elementData);
        });
    });

    // Create and display the properties dialog for an element
    function setupElementProperties(element, id) {
      element.addEventListener("click", function () {
        selectedElement = element;
        let elementTag= element.tagName.toLowerCase();
        const propertiesDiv = document.createElement("div");
        propertiesDiv.classList.add("properties-div");

        // Create element value input
        const elementValueInput = createPropertyInput("Element Value:", "element-value");
        propertiesDiv.appendChild(elementValueInput);

        // Add URL input for Button and Hyperlink
        if (elementTag === "button" || elementTag === "a") {
            const urlInput = createPropertyInput("Enter URL:", "url");
            propertiesDiv.appendChild(urlInput);
        }
        // Create color input with a palette
        const colorInput = createColorInput("Color:");
        propertiesDiv.appendChild(colorInput);

        // Create Font-size dropdown
        const fontSizeDropdown = createUnitDropdown("Font-size (in):", ["px", "em", "%", "rem"], "font-size-unit");
        propertiesDiv.appendChild(fontSizeDropdown);

        // Create Font-size slider
        const fontSizeSlider = createSliderInput("font-size", 1, 200, 16);
        propertiesDiv.appendChild(fontSizeSlider);

        // Create Margin dropdown
        const marginDropdown = createUnitDropdown("Margin (in):", ["px", "em", "%", "rem"], "margin-unit");
        propertiesDiv.appendChild(marginDropdown);

        // Create Margin input
        const marginInput = createPropertyInput("", "margin", null, "px");
        propertiesDiv.appendChild(marginInput);

        // Create Apply button
        const applyButton = document.createElement("button");
        applyButton.innerText = "Apply";
        applyButton.addEventListener("click", function () {
            applyElementProperties(selectedElement, id);
            propertiesDiv.remove();
        });
        propertiesDiv.appendChild(applyButton);

        // Create Delete button
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.addEventListener("click", function () {
            selectedElement.remove();
            propertiesDiv.remove();
            removeElementData(selectedElement, id);
        });
        propertiesDiv.appendChild(deleteButton);

        canvas.appendChild(propertiesDiv);
      });
    }

    // Apply the properties to the selected element
    function applyElementProperties(element, id) {
        const selectedElement = element;
        let elementTag = element.tagName.toLowerCase();
        if (!selectedElement) return;

        const marginSquares = document.querySelectorAll(".margin-squares input");
        const marginUnitSelect = document.querySelector(".properties-div select[name='margin-unit']");

        const marginProperties = {
            T: marginSquares[0].value + marginUnitSelect.value,
            R: marginSquares[1].value + marginUnitSelect.value,
            B: marginSquares[2].value + marginUnitSelect.value,
            L: marginSquares[3].value + marginUnitSelect.value,
        };

        // Apply margin properties to the element
        selectedElement.style.marginTop = marginProperties.T;
        selectedElement.style.marginRight = marginProperties.R;
        selectedElement.style.marginBottom = marginProperties.B;
        selectedElement.style.marginLeft = marginProperties.L;

        const color = document.querySelector(".properties-div input[name='color']").value;
        const fontSize = document.querySelector(".properties-div input[name='font-size']").value;
        const fontSizeUnit = document.querySelector(".properties-div select[name='font-size-unit']").value;
        if (elementTag === "button" || elementTag === "a") {
            const redirect_url = document.querySelector(".properties-div input[name= url]").value;
            selectedElement.style.redirect_url = redirect_url || "";
        }
        const elementValue = document.querySelector(".properties-div input[name='element-value']").value;

        selectedElement.style.color = color;
        selectedElement.style.fontSize = fontSize + fontSizeUnit;
        selectedElement.innerText = elementValue;

        updateElementData(selectedElement, id);
    }

    function createPropertyInput(labelText, propertyName, unitOptions, defaultUnit) {
        const label = document.createElement("label");
        label.innerText = labelText;
    
        const inputDiv = document.createElement("div");
        inputDiv.classList.add("property-input-div");

        // Create the input based on the property name
        let input;
        if (propertyName === "color") {
            input = document.createElement("input");
            input.setAttribute("type", "color");
        } else if (propertyName === "font-size") {
            input = document.createElement("input");
            input.setAttribute("type", "range");
            input.setAttribute("min", "1");
            input.setAttribute("max", "200");
            input.setAttribute("value", "16");
            input.setAttribute("name", propertyName);
            input.classList.add("slider-input");
            const sliderValue = document.createElement("span");
            sliderValue.classList.add("slider-value");
            input.addEventListener("input", function () {
                sliderValue.textContent = input.value;
            });
            inputDiv.appendChild(input);
            inputDiv.appendChild(sliderValue);
        } else if (propertyName === "margin") {
            const marginSquaresDiv = document.createElement("div");
            marginSquaresDiv.classList.add("margin-squares");
    
            const marginDirections = ["T", "R", "B", "L"];
            for (const direction of marginDirections) {
                const marginSquare = document.createElement("input");
                marginSquare.setAttribute("type", "text");
                marginSquare.setAttribute("name", `margin-${direction}`);
                marginSquare.setAttribute("maxlength", "3");
                marginSquare.classList.add("margin-square");
                marginSquare.placeholder = direction;
                marginSquaresDiv.appendChild(marginSquare);
            }
    
            inputDiv.appendChild(marginSquaresDiv);
    
            // Create the unit dropdown for margin
            if (unitOptions && unitOptions.length > 0) {
                const unitSelect = document.createElement("select");
                unitSelect.setAttribute("name", `${propertyName}-unit`);
                for (const unitOption of unitOptions) {
                    const option = document.createElement("option");
                    option.value = unitOption;
                    option.text = unitOption;
                    unitSelect.appendChild(option);
                }
                unitSelect.value = defaultUnit;
                inputDiv.appendChild(unitSelect);
            }
        } else {
            input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("name", propertyName);
        }
    
        if(input) {
            inputDiv.appendChild(input);
        }
    
        const div = document.createElement("div");
        div.appendChild(label);
        div.style.marginTop = "0.75rem";
        div.appendChild(inputDiv);
    
        return div;
    }

    function createColorInput(labelText) {
        const label = document.createElement("label");
        label.innerText = labelText;

        const input = document.createElement("input");
        input.setAttribute("type", "color");
        input.setAttribute("name", "color");
        input.classList.add("color-input");

        const div = document.createElement("div");
        div.appendChild(label);
        div.appendChild(input);

        const colorPalette = document.createElement("div");
        colorPalette.classList.add("color-palette");

        // Handle color input change
        input.addEventListener("input", function () {
            const colorValue = input.value;
        });

        div.appendChild(colorPalette);

        return div;
    }

    // Create a unit selection dropdown
    function createUnitDropdown(labelText, unitOptions, name) {
        const label = document.createElement("label");
        label.innerText = labelText;

        const unitSelect = document.createElement("select");
        unitSelect.setAttribute("name", name);

        for (const unitOption of unitOptions) {
            const option = document.createElement("option");
            option.value = unitOption;
            option.text = unitOption;
            unitSelect.appendChild(option);
        }

        const div = document.createElement("div");
        div.appendChild(label);
        div.appendChild(unitSelect);

        return div;
    }

    // Create a slider input
    function createSliderInput(name, min, max, value) {
        const sliderDiv = document.createElement("div");
        sliderDiv.classList.add("slider-input");

        const slider = document.createElement("input");
        slider.setAttribute("type", "range");
        slider.setAttribute("min", min);
        slider.setAttribute("max", max);
        slider.setAttribute("value", value);
        slider.setAttribute("name", name);

        const sliderValue = document.createElement("span");
        sliderValue.classList.add("slider-value");
        sliderValue.textContent = value;

        slider.addEventListener("input", function () {
            sliderValue.textContent = slider.value;
        });

        sliderDiv.appendChild(slider);
        sliderDiv.appendChild(sliderValue);

        return sliderDiv;
    }

    // Update element data in the array
    function updateElementData(element, id) {
        const selectedElement = element;
        if (!selectedElement) return;

        const elementData = elementDataArray.find(data => data.id === id);
        if (elementData) {
            elementData.properties.marginTop = selectedElement.style.marginTop || "";
            elementData.properties.marginBottom = selectedElement.style.marginBottom || "";
            elementData.properties.marginLeft = selectedElement.style.marginLeft || "";
            elementData.properties.marginRight = selectedElement.style.marginRight || "";
            elementData.properties.color = selectedElement.style.color;
            elementData.properties.fontSize = selectedElement.style.fontSize;
            elementData.properties.redirect_url = selectedElement.style.redirect_url || "";
            elementData.properties.elementValue = selectedElement.innerText;
        }
    }


    // Remove element data from the array
    function removeElementData(element, id) {
        const selectedElement = element;
        if (!selectedElement) return;

        const index = elementDataArray.findIndex(data => data.id === id);
        if (index !== -1) {
            elementDataArray.splice(index, 1);
        }
    }
    
    //UI-Code Conversion Logic
    const btn = document.getElementById("btn");
    if(btn){
        btn.addEventListener("click",function () {
            let htmlCode = '';
            let cssCode = '';
            let jsCode = '';
            
            console.log(elementDataArray);

            elementDataArray.forEach(item => {
              const { id, properties, type } = item;
          
              // Generate HTML
              let elementHTML = '';
              switch (type) {
                case 'button':
                  elementHTML = `
                  <button id="${id}">
                      ${properties.elementValue}
                  </button>
                  `;
                  break;
                case 'label':
                  elementHTML = `
                  <label id="${id}">
                      ${properties.elementValue}
                  </label>
                  `;
                  break;
                case 'hyperlink':
                  elementHTML = `
                  <a id="${id}" href="${properties.redirect_url}">
                      ${properties.elementValue}
                  </a>
                  `;
                  break;
                default:
                  break;
              }
          
              htmlCode += elementHTML;
          
              // Generate CSS
              const elementCSS = `
              #${id} {
                color: ${properties.color};
                font-size: ${properties.fontSize};
                margin: ${properties.margin};
              }
              `;
          
              cssCode += elementCSS;
          
              // Generate JavaScript (Assumed that buttons have redirect links)
              if (type === 'button') {
                const elementJS = `
                document.addEventListener("DOMContentLoaded", function () {
                    let id = document.getElementById("${id}");
                    id.addEventListener("click", function() {
                        var url = "${properties.redirect_url}";
                        window.open(url, "_blank");
                    });
                });
                `;
          
                jsCode += elementJS;
              }
            });
            
            //Display Codes generated
            function displayCodes(htmlCode, cssCode, jsCode){
                const htmlCodeToDisplay = document.querySelector(".html");
                const cssCodeToDisplay = document.querySelector('.css');
                const jsCodeToDisplay = document.querySelector('.js');

                htmlCodeToDisplay.innerText = htmlCode;
                cssCodeToDisplay.innerText = cssCode;
                jsCodeToDisplay.innerText = jsCode;
            }
            displayCodes(htmlCode, cssCode, jsCode);
        });
    }
});

