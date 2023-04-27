NetAddr.langPort;
NetAddr.localAddr;

(

OSCdef.new(\Dataset,
	{
	arg msg;

	~dataset = msg[1].asString;
	//~dataset.postln;


	}, '/dataset'

);

)