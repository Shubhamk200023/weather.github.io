const timeE1=document.getElementById('time');
const dateE1=document.getElementById('date');

const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector("header i");

const days=['Sun','Mon','Tues','Wed','Thurs',
'Fri','Sat'];
const months=['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','dec'];

setInterval(() => {
    const time=new Date();
   
    const month=time.getMonth();
    const date=time.getDate();
    const day=time.getDay();
    const hour=time.getHours();
    const hoursIn12hr= hour % 12;
const minutes=time.getMinutes();
const seconds=time.getSeconds();
const ampm= hour >=12 ?'PM' : 'AM'

timeE1.innerHTML=hoursIn12hr+ ':' + minutes+ ':' + seconds +' ' +`<span id="AM-PM">${ampm}</span> `
dateE1.innerHTML=days[day]+',' +date+',' + months[month]  

},1000);
let api;

inputField.addEventListener("keyup", e =>{
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Your browser not support geolocation api");
    }
});

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=d090400275e1834b33fd56192a6fb43f`;
    fetchData();
}

function onSuccess(position){
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=d090400275e1834b33fd56192a6fb43f`;
   
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
        infoTxt.innerText = "Something went wrong";
        infoTxt.classList.replace("pending", "error");
    });
}

function weatherDetails(info){
    if(info.cod == "404"){
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;

        if(id == 800){
            wIcon.src = "./weather-app-icons/clear.png";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "./weather-app-icons/storm.png";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "./weather-app-icons/snow.png";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "./weather-app-icons/haze.png";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "./weather-app-icons/cloud.png";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "./weather-app-icons/rain.png";
        }
        
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});



