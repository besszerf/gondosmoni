/*
					A kép kinagyítása:
*/

	function beillKep(kepG, kepSz) {
	    kepGaler = kepG;
	    document["slideImg"].src = "images/galeria/" + kepG + "/" + kepSz + ".jpg";
	    imageN = kepSz - 1;
	}

	function ShowDiv(y, kepGal, kepSzam) { //Ez hívódik meg képre kattintáskor; y=div.id;
	    //get viewport's width and height
	    vpWidth=self.innerWidth;
		 var jelzo;
		 if(vpWidth<600){
			 vpHeight = self.innerHeight-40;
			 jelzo = true;
		 }else{
			 vpHeight = self.innerHeight;
		 	 jelzo = false;
		 }
		if(vpHeight/vpWidth >= 1.287){
			kepSzel=vpWidth-72;
			kepMag =  Math.floor(kepSzel/0.75);
			divHeight = kepMag+67;
			divWidth = vpWidth-20;
		}else if(vpHeight/vpWidth < 1.287){
			kepMag=vpHeight-67;
			kepSzel = Math.floor(kepMag/1.333);
			divHeight = vpHeight-16;
			divWidth = kepSzel+72;
		}
		
		margoFugg = "130px";
		document["slideImg"].style.height=(kepMag + "px");
		document.getElementById("sor1").style.height=(kepMag + "px");
		document["slideImg"].style.width=(kepSzel+ "px");
		z=document.getElementById("sor1");
		z.getElementsByTagName("p")[0].style.marginTop=(margoFugg);
		z.getElementsByTagName("p")[1].style.marginTop=(margoFugg);
		document.getElementById("slidekoz").style.height=((kepMag+20) + "px");
		document.getElementById("slidekoz").style.width=((kepSzel+40) + "px");

	    beillKep(kepGal, kepSzam);
	    document.getElementById("sheet").style.display="inline";
	    x=document.getElementById(y);
	    x.style.position="fixed";
				  //calculate position
				  divTop = (jelzo)
					  ?(vpHeight/2) - (divHeight/2)+45
					  :(vpHeight/2) - (divHeight/2);
				  divLeft = (vpWidth/2) - (divWidth/2);
				  //Position the Dialog
				  x.style.top = divTop+"px";
				  x.style.left =divLeft+"px";
				  a = x.style.display="block";
	}

/*
					A slideshow:
*/

// Képtömb létrehozása, képek váltása	(slide2.js egyszerűsített változata
var interval = 2000; // A képek megjelenésének ideje
var atmenet = 500; // Az átmenet (fokozatos halványulás) ideje - a megjelenés ideje ugyanennyi!
var halvanyit = true;
var irany = true; // merre váltsanak a képek true -előre, false-vissza
var folyamatos = false; // ha folyamatos lejátszás, akkor "true"
var ciklIt = 0; // átmenethez ciklus számláló
var atlatsz = 1; // megmutatja mennyire átlátszó a kép: 0 - teljesen, 1 - egyáltalán nem átlátszó
var imageDir; // képek könyvtár
var imageNum = 0; // a tömb indexe
var timerFade; // az átmenet időzítője
var kephely;
var tovabb;
var totalImages;
var elso = true;
var kepGalMut;
var hPl = false;
var hPa = true;

function becsuk(){
    ujOpen=true; //pauseSlide();
//    hatterPaus();
    document.getElementById("sheet").style.display="none";
    document.getElementById("bezar").style.display="none";
}

function playSlide(place, ir, foly) {
    if (!folyamatos) {
		if (kepGalMut != kepGaler) {
			elso = true;
		}
		if (elso) {
			kepTomb();
			totalImages = imageArray.length; // képek száma
			kepGalMut = kepGaler;
			elso = false;
		}
		if (ujOpen) {
			imageNum = imageN;
			ujOpen=false;
		}
		kephely = place;
		halvanyit = true;
		trans = 1;
		ciklIt = 0;
		if (ir=="t") {
			irany = true;
		} else {
			irany = false;
		}
		if (foly=="t") folyamatos = true;
		if (timerFade==undefined){timer();}
    }
}

function kepTomb() {
     if (kepGaler == "hordozas") {
	imageDir = "images/galeria/hordozas/";
	imageNum = 0;
	imageArray = new Array(); // a képeket tartalmazó tömb
	imageArray[imageNum++] = new imageItem(imageDir + "1.jpg");
	imageArray[imageNum++] = new imageItem(imageDir + "2.jpg");
	imageArray[imageNum++] = new imageItem(imageDir + "3.jpg");
	imageArray[imageNum++] = new imageItem(imageDir + "4.jpg");
	imageArray[imageNum++] = new imageItem(imageDir + "5.jpg");
	imageArray[imageNum++] = new imageItem(imageDir + "6.jpg");
	imageArray[imageNum++] = new imageItem(imageDir + "7.jpg");
	imageArray[imageNum++] = new imageItem(imageDir + "8.jpg");
	imageArray[imageNum++] = new imageItem(imageDir + "9.jpg");
	imageArray[imageNum++] = new imageItem(imageDir + "10.jpg");
    } else if (kepGaler == "babamasszazs") {
	imageDir = "images/galeria/babamasszazs/";
	imageNum = 0;
	imageArray = new Array(); // a képeket tartalmazó tömb
	imageArray[imageNum++] = new imageItem(imageDir + "1.jpg");
	imageArray[imageNum++] = new imageItem(imageDir + "2.jpg");
	imageArray[imageNum++] = new imageItem(imageDir + "3.jpg");
	imageArray[imageNum++] = new imageItem(imageDir + "4.jpg");
	imageArray[imageNum++] = new imageItem(imageDir + "5.jpg");
	imageArray[imageNum++] = new imageItem(imageDir + "6.jpg");
	}
}

/* lenti függvény hozza létre a képtömböt; gyakorlatilag kétdimenziós tömböt építünk,
   egyik dimenzió (változó) maga a kép objektum (ezt illesztjük a weboldalba),
   a másik pedig a kép forrása (megmondja honnan kell beolvasni a képet)
*/
function imageItem(image_location) { // létrehozni a tömböt két jellemzővel
    this.image_item = new Image();
    this.image_item.src = image_location;
}

function get_ImageItemLocation(imageObj) { // Visszatér a paraméterként átadott kép objektum forrásával
    return(imageObj.image_item.src)
}

function getNextImage() { // meghatározza a következő kép indexét, forrását, visszatér a forrással
         imageNum = (imageNum+1) % totalImages;
    var new_image = get_ImageItemLocation(imageArray[imageNum]);
    return(new_image);
}

function getPrevImage() { // visszatér az előző kép forrásával
	imageNum = (imageNum > 0)? (imageNum-1) % totalImages : totalImages -1;
	var new_image = get_ImageItemLocation(imageArray[imageNum]);
	return(new_image);
}

function timer() {
	timerFade = setInterval(function() {placeImage(kephely)}, 20); // fakulás miatt
}

function placeImage(kephely) { // elhelyezi a következő képet a weblapon
	if (halvanyit) { // halványítás
	    ciklIt++;
	    atlatsz = 1-(10/atmenet*ciklIt*2).toString();
	    opaBeall(atlatsz);
	    if (atlatsz == 0) { // új kép betöltése
		ciklIt = 0;
		halvanyit = false;
			if (irany) { // előre megyünk
				var new_image = getNextImage();
				document[kephely].src = new_image;
			} else { // vissza megyünk
				var new_image = getPrevImage();
				document[kephely].src = new_image;
			}
	    }
	} else { // megjelenítés
	    ciklIt++;
	    atlatsz = 10/atmenet*ciklIt*2.5;
	    opaBeall(atlatsz);
	    if (atlatsz == 1) { // nincs átmenet ekkor
			clearInterval(timerFade);
			timerFade=undefined;
			halvanyit = true;
			ciklIt = 0;
			if (folyamatos) { // csak folyamatos lejátszás esetén újra időzítünk
				tovabb = setTimeout(function() {timer()}, interval)
			}
	    }
	}
}

// Inicializálás
		var kepGaler = "null";
		var ujOpen = true;
		var imageN = 0;
		function opaBeall(ertek){
			if (window.ActiveXObject) {
				document.slideImg.style.filter = "alpha(opacity="
	             + ertek*100 + ")"; // IE
			} else {
	        document.slideImg.style.opacity = ertek; // Többi
			}
		}
