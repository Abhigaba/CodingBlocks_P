
const submitbtn = document.querySelector('.submit');
const first_no = document.querySelector('#first_no')
const second_no  = document.querySelector('#second_no')


const updateTable = (data) => {
    const product = document.querySelector('.Product');
    const sum = document.querySelector('.Sum');
    const diff = document.querySelector('.Difference'); 

    product.textContent = `${data.product}`
    sum.textContent = `${data.sum}`
    diff.textContent = `${data.diff}`
    
}

submitbtn.addEventListener('click', async (e) => {
    e.preventDefault(); 

    try{
        const res = await axios.get(`/calculate/${first_no.value}/${second_no.value}`)
        const data = res.data ;
        updateTable(data);
    }
        catch(error) { 
            console.log("Error occured: ", error)
        }
})