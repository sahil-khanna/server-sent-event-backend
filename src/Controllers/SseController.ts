import { Request, Response } from 'express';

export class SseController {

    private static clients: Response[] = new Array();

    constructor() {
        this.register = this.register.bind(this);
        this.send = this.send.bind(this);
    }

    public register(request: Request, response: Response) {
        response.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        SseController.clients.push(response);
        response.write("data: " + this.preparePayload({type: 0}) + "\n\n")
    }

    private preparePayload(payload) {
        var payloadString = JSON.stringify(payload);
        return Buffer.from(payloadString).toString("base64");
    }
    
    public send(request: Request, response: Response) {
        SseController.clients.forEach(element => {
            element.write("data: " + this.preparePayload(request.body) + "\n\n");
        });

        response.json({message: "success"});
    }
}