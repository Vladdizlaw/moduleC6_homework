//Находим нужные элементы

const input=document.querySelector(".entermessage")
const btnSend=document.querySelector(".j-btn-send")
const btnGeo=document.querySelector(".j-btn-geo")
const sideboard=document.querySelector(".sideboard")
let websocket
const wsUri='wss://echo.websocket.org/'

function displayMessage(message,flag){
	//Функция выводит сообщения на экран в зависимости от флага
	const divOutput=document.createElement('div')
	const date= new Date()
	
	switch(flag) {
		case 'user':
			divOutput.style='margin-right:5%;max-width:25%;border-style:solid;border-radius:10px;background:rgba(201,237,237, 0.5);text-align:center;align-self:flex-end;'
			break
		case 'response':
			divOutput.style='margin-left:5%;max-width:25%;border-style:solid;border-radius:10px;background:rgba(41,238,238, 0.5);text-align:center;align-self:flex-start;'	
			break
		case 'system':
			divOutput.style='max-width:25%;border-style:solid;border-radius:10px;background:rgba(140,238,41, 0.5);text-align:center;align-self:center;'		
			break
		}

	

	divOutput.innerHTML=`<p style="padding:10px 10px;">${message}</p><small>${(date.getHours()<10?'0':'') + date.getHours()}:${(date.getMinutes()<10?'0':'') + date.getMinutes()}</small>`
	sideboard.appendChild(divOutput)
	sideboard.scrollTo(0,sideboard.offsetHeight*100)//Для того что бы чат все время проматывался вниз
}

function socketOpen(uri){
	//Функция установления соединения
	websocket=new WebSocket(uri)
	websocket.onopen=function(evt){
		displayMessage("System:connected to server",'system')
	}
	websocket.onclose=(evt)=>{
		displayMessage("System:disconnected",'system')
	}
	websocket.onmessage=(evt)=>{
		if (evt.data!="Геопозиция"){
		displayMessage(evt.data,'response')
	}
	}
	websocket.onerror=(evt)=>{
		displayMessage(`Error ${evt.data}`)
	}
}

function getGeo(){
	//Функция получения геолокации
	if (!navigator){
		displayMessage('Geoposition is unaviable','system')
	}else{
		navigator.geolocation.getCurrentPosition(successPosition,errorPosition)
	}
}

function successPosition(pos){
	//при положительном  ответе на запрос позиции 
	const divOutput=document.createElement('div')
	divOutput.style='margin-right:5%;max-width:25%;border-style:solid;border-radius:10px;background:rgba(201,237,237, 0.5);text-align:center;align-self:flex-end;'
	mapLink=document.createElement('a')
	mapLink.target='_blank'
	mapLink.style="padding:10px 10px"
	mapLink.href=`https://www.openstreetmap.org/#map=18/${pos.coords.latitude}/${pos.coords.longitude}`
	mapLink.textContent="Геопозиция"
	divOutput.appendChild(mapLink)
	sideboard.appendChild(divOutput)
	websocket.send(mapLink.textContent)//По условию задачи надо отправить на сервер
	sideboard.scrollTo(0,sideboard.offsetHeight*100)

}

function errorPosition(pos){
	//при отрицательном  ответе на запрос позиции 
	displayMessage('Access denied','system')
}




btnSend.addEventListener('click',()=>{
	//Считываем инпут , выводим сообщение и отправляем на сервер
	if(input.value){
	const message=input.value
	displayMessage(message,'user')
	input.value=''
	websocket.send(message)
}
})

btnGeo.addEventListener('click',getGeo)

socketOpen(wsUri)