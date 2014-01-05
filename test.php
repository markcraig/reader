<?php
	require_once "dropbox-sdk/Dropbox/autoload.php";
	use \Dropbox as dbx;

	$appInfo = dbx\AppInfo::loadFromJsonFile("dropbox.json");
	$dbxConfig = new dbx\Config($appInfo, "PHP-Example/1.0");
	
	$webAuth = new dbx\WebAuth($dbxConfig);
	list($requestToken, $authorizeUrl) = $webAuth->start("http://localhost/~mark/reader/test.php");
	
	echo "1. Go to: " . $authorizeUrl . "\n";
	echo "2. Click \"Allow\" (you might have to log in first).\n";
	echo "3. Hit ENTER to continue.\n";
	fgets(STDIN);
	
	list($accessToken, $dropboxUserId) = $webAuth->finish($requestToken);
	print "Access Token: " . $accessToken->serialize() . "\n";
	
	$dbxClient = new dbx\Client($dbxConfig, $accessToken);
	$accountInfo = $dbxClient->getAccountInfo();
	print_r($accountInfo);
?>