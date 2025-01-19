$('ul').on('click','.delete-button', function(e) {
    $(this).parent().fadeOut(500, function() {
        $(this).remove()
    })
})

$('ul').on('click','.complete-button', function(e) {
    $(this).parent().toggleClass('complete')
})

$('#add-button').click(function() {

    $('ul').append(`   <li class='todo-item'>
                    <span class='task-text'>${$('#todo-input').val()}</span>
                    <button class='complete-button'>Complete</button>
                    <button class='delete-button'>Delete</button>
                </li>`)
    
})