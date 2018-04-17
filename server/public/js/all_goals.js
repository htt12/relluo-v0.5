$(document).ready(initializeApp);

function initializeApp(){
    getData();
    
}

function getData(){
    $.ajax({
        type: 'GET',
        url: '/goalssql',
        dataType: 'json',
        jsonpCallback: 'callback',
        crossDomain: true,
        cache: false,
        success: function(resp){
            console.log(resp);
            $('.all-goals-list').empty();
            rendergoalOnDashboard(resp.data)

            $('html, body').animate({
                scrollTop: $('.all-goals-list').offset().top}, 2000)
            
        },
        error: function(xhr, status, err){
            console.log(err)
        }
    })
}




function editGoal(goalSelected, goalId){

    let textToEdit = $(goalSelected).find('.goal-description');

    $(goalSelected +'> .goal-description').text('');

    $("<input class='center' type='text'>").css({
        'margin': '3px',
        'border-bottom': '3px yellow solid',
        'height': '100%',
        'width': '100%',

    }).appendTo(textToEdit).focus();

    $('input').on('focusout', ()=>{

        let edit = $('input').val();

        $(goalSelected+'> .goal-description').text(edit);

        console.log(edit);
        $('input').remove();


        console.log('goalID', goalId);
        $.ajax({
            type: 'POST',
            data: {
                goal: edit,
                goal_id: goalId,
            },
            url: '/goals/update',
            // dataType: 'json',

            success: function(resp){
                console.log('edit',resp);
                getData();
            },
            error: function(xhr, status, err){
                console.log(err)
            }
        })
    })
}

function deleteGoal(goalId){
    console.log('goalID', goalId);
    $.ajax({
        type: 'POST',
        data: {
            goal_id: goalId,
        },
        url: '/goals/delete',
        // dataType: 'json',
        
        success: function(resp){
            console.log('delete',resp);
            setTimeout(()=>{
                $('.goal-list').empty();
                getData()
            }, 1000);
        },
        error: function(xhr, status, err){
            console.log(err)
        }
    })
}

// function deleteGoal(goalId){
//
//     $.ajax({
//         type: 'POST',
//         data: {
//             goal_id: goalId,
//         },
//         url: 'http://localhost:8000/goals/delete',
//         // dataType: 'json',
//
//         success: function(resp){
//             console.log('delete',resp);
//             $('.goal-list').empty();
//             getData();
//         },
//         error: function(xhr, status, err){
//             console.log(err)
//         }
//     })
// }




function rendergoalOnDashboard(goals){
    console.log('goals',goals)
    var users = []

    

    for(var i=0; i<goals.length;i++){
        users.push(goals[i]);
        //Gets goal description
        var goalDescription = goals[i].goal;
        let goalId = goals[i].goal_id;
        let timeOfDay = 'rgb(219, 85, 78, 0.5)';
        switch (parseInt(goals[i].timeframe)){
            case 1:
                timeOfDay = 'rgb(66, 134, 244, 0.5)';
                break;
            case 2:
                timeOfDay = 'rgb(64, 27, 137, 0.5)';
                break;
            default:
                break;
        }
        
        //Creates goal container for each goal
        var goalContainer = $('<div>').addClass('goal-container goal ').attr('id','goalId'+goalId).css('background-color' , timeOfDay);
        
        //Creates a container with the goal description
        var goalBar = $("<div>").addClass('goal-description z-depth-1').text(goalDescription);
        
        //Creates drop down menu to mark goal as edit or delete
        var dropDownMenuButtonContainer = $('<div>').addClass('button-container z-depth-1 ');
        
        var editButton = $('<button>').addClass('dropdown-button dropdown-trigger goal-button material-icons').attr('data-activates', 'dropdown'+goalId).text('menu');
        
        var dropDownList = $('<ul>').addClass('dropdown-content').attr('id','dropdown'+goalId);
        
        let goalSelector = '#goalId'+goalId;

        
        var editItem = $('<li>').addClass('edit center-align').on('click', ()=>{
            
            editGoal(goalSelector, goalId)
            }
        ).wrapInner('<a href="#">Edit</a>');
        
        var deleteItem = $('<li>').addClass('delete center').on('click', ()=>{
            
            $(goalSelector).addClass('animated bounceOutDown');
            deleteGoal(goalId);
       
        }).wrapInner('<a>Delete</a>')

        
        dropDownList.append(editItem, deleteItem);


        dropDownMenuButtonContainer.append(editButton,dropDownList);
        
        goalContainer.append(goalBar, dropDownMenuButtonContainer);
        $('.all-goals-list').append(goalContainer);
        

        // $('.edit').wrapInner('<a href="#">edit</a>')
        $('.dropdown-trigger').dropdown();
             
    }

    for(var j=1; j<goals.length; j++){
        let initialChildElement = $('.all-goals-list:nth-child(' +j+')');
        let nextChildElement = $('.all-goals-list:nth-child(' +j+1+')');
        if(initialChildElement.css('background-color') !== nextChildElement.css('background-color')){
            initialChildElement.css('background-color', 'hotpink');
            nextChildElement.css('background-color', 'yellow');
        } 
    }
    

    // reminders(users);
}


// function reminders(users){
//     let startDate = new Date(users[0].startdate);
//     let endDate = new Date(users[0].finishdate);
    
//     console.log(startDate.getUTCDate()); // Hours
//     console.log(endDate.getUTCDate());
    
//     let duration = 4;;
//     console.log('startDate', startDate, endDate);

//     if(duration < 7){
//         displayReminder(users[0].goal);
//     }
// }

// function displayReminder(goal){
//     let reminder = $('<div>').addClass('reminder').text(goal);
//     $('.dashboard-container').append(reminder);
// }

// function retrieveServerData(){
//     var apiKey = {api_key: 'uTqhiGEpct'}; //'force-failure': 'timeout'
    
//     $.ajax({
//             data: apiKey,
//             url: 'http://s-apis.learningfuze.com/sgt/get',
//             method: 'post',
//             dataType: 'json',
//             success: function(response){
//                 $('.student-table-row').remove();
//                 $("#getServerDataButton").button('reset'); 
//                 console.log(response);                       
//                 for(var i=0; i<response.data.length; i++){
//                         student_array.push(response.data[i]);
//                         updateStudentList(student_array);
//                 }
                
//             }
//     });
  
//   }