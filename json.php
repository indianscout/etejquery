<?php
$data = array( 	'caption' 	=> "E.T. is calling home... gets feeded with ajax rock 'n' roll...",
				'th' 		=> array('No.',		'Space-Taxi' 			,'Earth' 	,'Jupiter' 	,'Saturn' 	,'Uranus' 	,'Neptun'),
				'table'		=> array(	array('Alan' 				,6			,''			,''			,''			,22		),
										array('Ida' 				,12 		,15			,'17:30'	,18			,20		),
										array('Enterprise' 			,8			,'9:30'		,'10:30'	,11			,12		),
										array('Clingonian spaceship' ,16 		,'17:30'	,''			,19			,20		),
										array('Space shuttle' 		,6			,''			,''			,''			,22		),
										array('Ariane' 				,6			,null		,null		,null		,24		),
										array('Superman'			,6			,''			,''			,''			,24		)
									)
				);
echo json_encode($data);
?>