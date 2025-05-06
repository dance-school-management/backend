import path from "path";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import logger from "../utils/winston";

export class ProductServer {
  port: number;
  packages: grpc.GrpcObject;
  server: grpc.Server;
  constructor(protoRoot: string, port: number) {
    this.port = port;

    this.packages = {
      productCommunication: this.loadProto(
        path.join(protoRoot, "productCommunication.proto"),
      )
    };

    this.server = new grpc.Server();
    this.loadAllProtos();
  }

  /**
   * Handler for PaymentService.Charge.
   * @param {*} call  { ChargeRequest }
   * @param {*} callback  fn(err, ChargeResponse)
   */
  static CheckClassHandler(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    try {
      logger.info(
        `ProductkServic#CheckClass invoked with request ${JSON.stringify(call.request)}`,
      );
      const response = charge(call.request);
      callback(null, response);
    } catch (err) {
      console.warn(err);
      callback(err);
    }
  }

  listen() {
    const server = this.server;
    const port = this.port;
    server.bindAsync(
      `[::]:${port}`,
      grpc.ServerCredentials.createInsecure(),
      function () {
        logger.info(`PaymentService gRPC server started on port ${port}`);
      },
    );
  }

  loadProto(path: string) {
    const packageDefinition = protoLoader.loadSync(path, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });
    return grpc.loadPackageDefinition(packageDefinition);
  }

  loadAllProtos() {
    // Dostajemy się do wygenerowanego pakietu productcommunication
    const productCommunicationPackage = this.packages.productCommunication.productcommunication;
  
    // Dodajemy serwis EnrollWithProduct i handler do CheckClass
    this.server.addService(productCommunicationPackage.EnrollWithProduct.service, {
      CheckClass: ProductServer.CheckClassHandler.bind(this),
    });
  }
}



