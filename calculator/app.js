const screen = document.querySelector('.input'); 
const numbers = document.querySelectorAll('.numbers')

console.log(numbers)



numbers.forEach((n) => {
    n = n.children
    
    for(let el of n){

        el.addEventListener('click', () => {
        console.log(el)    
            const innerText = el.innerText ;
            
            if (screen.innerText === 'Invalid Operation') { 
                screen.innerText = "";
            }
            if (innerText === 'X') { 
                screen.innerText += '*' ;
            }
            else if (innerText === 'C') { 
                screen.innerText = '' ;

            }
            else if (innerText ===  '='){
                try { 
                    screen.innerText = eval(screen.innerText);
                }
                catch(error) { 
                    screen.innerText = 'Invalid Operation';
                }
            }
            else {
                screen.innerText += innerText;
            }
        })}
    }        
    )
