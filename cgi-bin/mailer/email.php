<?
if(!$_POST) {
    exit;
}

function post_captcha($user_response) {
	$fields_string = '';
	$fields = array(
			'secret' => '6Lf1TEAhAAAAAKDl1aFvZttsT_DLCCqhODWT4YBZ',
			'response' => $user_response
	);
	foreach($fields as $key=>$value)
	$fields_string .= $key . '=' . $value . '&';
	$fields_string = rtrim($fields_string, '&');

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'https://www.google.com/recaptcha/api/siteverify');
	curl_setopt($ch, CURLOPT_POST, count($fields));
	curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, True);

	$result = curl_exec($ch);
	curl_close($ch);

	return json_decode($result, true);
}


include('class.phpmailer.php');
include('class.smtp.php');
 
header('Content-Type: text/html; charset=utf-8');
	
$email = $_POST['email'];
$error = '';

function sendEmail($address, $sender, $subject, $text){
	$dsn = 'sqlite:123.db';
	try {
		if ($dbh = new PDO($dsn)) {
		$STH = $dbh->query('SELECT * FROM tbl WHERE id=1');  
		$STH->setFetchMode(PDO::FETCH_NUM);  
		$fields = $STH->fetch();

		$dbh = null;
		$from = $fields[4];

		$fromName = $sender=="0"?"Webmaster":$fields[5];

		$emma = $address=="0"?$fields[6]:$address;

		}
		$mail = new PHPMailer();
		$mail->CharSet = 'UTF-8';
		$mail->SetLanguage('hu');
		$mail->IsSMTP(); // SMTP
		$mail->SMTPDebug = 1;  // debugging: 1 = errors and messages, 2 = messages only
		$mail->SMTPAuth = true;  // auth required
		$mail->SMTPSecure = 'ssl'; // use ssl
		$mail->Host = $fields[3];//'smtp.gmail.com'

		$mail->Port = 465;
		$mail->Username = $fields[1];

		$mail->Password = $fields[2];

		$mail->SetFrom($from, $fromName);//$mail->From("Webmaster@gondosmoni.hu");
		$mail->Subject = "=?UTF-8?B?" . base64_encode($subject) . "?=";
		$mail->Body = urldecode($text);
		$mail->AddAddress($emma);
		if(!$mail->Send() && $emma == $fields[6]) {

			$GLOBALS["error"] = 'HIBA: Üzenete nem lett kézbesítve! <br><br>'.$mail->ErrorInfo;
		}else{
			return true;
		}
	} catch (PDOException $e) {
		$GLOBALS["error"] = 'SZERVER HIBA: Jelezze kérem facebookon keresztül.
								 Köszönettel: Besszer Mónika'; //. $e->getMessage();
	}
}

try{
	$res = post_captcha($_POST['g-recaptcha-response']);
	if (!$res['success']) {
		// What happens when the reCAPTCHA is not properly set up
		die('reCAPTCHA error: Check to make sure your keys match the registered domain and are in the correct locations. You may also want to doublecheck your code for typos or syntax errors.');
	}
	// if no captcha appears put this back
	// if (!($res['score'] > 0.5)) {
	// 	// robots
	// 	die('You are robot.');
	// }

	include('class.EmailAddressValidator.php');
	$validator = new EmailAddressValidator;
	if ($validator->check_email_address($email)) { // helyes, jöhet a mezők ellenőrzése
		$values = array ('name','email','message');
		$required = array('name','email','message');

		$email_subject = "Új üzenet a WEB-ről - ".$_POST['name'];
		$email_subject2 = "Automata értesítés üzenete feldolgozásáról";
		$email_content = "Tartalom:\n";
		$email_content2 = "Amennyiben nem Ön küldte ezt az üzenet, a levelet kérem hagyja figyelmen kívül!\n\n";

		$i=1;
		foreach($values as $value){ // form integritásának ellenőrzése
			if(in_array($value,$required)){
				if($i==1) {
				$ertek="neve";
				}elseif($i==2){
				$ertek="e-mail címe";
				}else{
				$ertek="üzenete";
				}
					if(empty($_POST[$value])) {
				print ('HIBA: Töltse ki a(z) "'.$ertek.'" mezőt!');
				exit;
				}
				if($i==3) {
				$email_content .= 'A küldő '.$ertek.':'."\n\n".$_POST[$value];
				} else {
				$email_content .= 'A küldő '.$ertek.': '.$_POST[$value]."\n";
				}
				$i++;
			}
		}
		$email_content2 .= $email_content;

		if(sendEmail('0','0',$email_subject,$email_content) && sendEmail($email,'1',$email_subject2,$email_content2)) { // Móninak - visszaigazoló
			echo 'Üzenetét sikeresen elküldtük!'; 
		}elseif($error !='') {
			echo $error;
		}else{
			echo 'Üzenetét kézbesítettük, a visszaigazoló levelet viszont sajnos átmeneti hiba miatt nem tudtuk elküldeni. Nincs semmi teendője - nemsokára válaszolok: Gondos Mónika';
		}
	}else {
		die('HIBA: Ellenőrizze az email címet!');
	}
}catch (Exception $e) {
	print 'HIBA: '.$e;
}

?>
