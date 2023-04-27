import { WsocketService } from '../services/wsocket.service';


  constructor(private wsocketService: WsocketService) {
    this._audio = new Audio();
    wsocketService.messages.subscribe(msg => {
      console.log("Response from websocket: " + msg);
    });
  }

  sendMsg(message: any) {
    this.wsocketService.messages.next(message);
  }


  ngOnInit(): void {

    const fileName = this.tt.inputData;

    console.log(fileName);

    this.dc = this.tt.displayCondition;

    d3.csv("assets/data/" + fileName + ".csv", (data: any) => {
      this.dimensions.forEach((an: any) => data[an] = parseFloat(data[an]));
      return data;
    }).then((data) => {
      this.chart(data, fileName);
    });

  }

  private chart(data: any, fileName: any) {


    // Send dataset name to SuperCollider
    const msg = { "dataset": { "dataset": fileName } };
    //console.log(msg);
    this.sendMsg(msg)

  }