NetAddr.langPort;
NetAddr.localAddr;

(

OSCdef.new(\dataset,
	{
	arg msg;
	msg = "hej!";
	~dataset = msg[1].asString;
	//~dataset.postln;


	}, '/dataset'

);

)