from tensorflow import keras
from tensorflow.keras import layers
from config import LEARNING_RATE


def build_model_from_config(config):


    # config2 = { "input_dim": 20, 
    #            "layers": [ 
    #                {"type": "Dense", "units": 64, "activation": "relu"}, 
    #                {"type": "Dropout", "rate": 0.4}, 
    #                {"type": "Dense", "units": 12, "activation": "relu"}, 
    #                {"type": "Dense", "units": 1, "activation": "sigmoid"} 
    #                ], 
    #                "compile": { 
    #                    "optimizer": { 
    #                        "type": "Adam", 
    #                        "learning_rate": 0.001 }, 
    #                     "loss": "binary_crossentropy", 
    #                     "metrics": ["accuracy"] 
    #                     } 
    #             }


    model = keras.Sequential()
    model.add(layers.Input(shape=(config.input_dim,)))

    for layer_cfg in config.layers:
        if layer_cfg.type == "Dense":
            model.add(layers.Dense(
                units=layer_cfg.units,
                activation=layer_cfg.activation
            ))

        elif layer_cfg.type == "Dropout":
            model.add(layers.Dropout(rate=layer_cfg.rate))

        elif layer_cfg.type == "BatchNormalization":
            model.add(layers.BatchNormalization())

    optimizer = getattr(keras.optimizers, config.compile.optimizer.type)(
        learning_rate=config.compile.optimizer.learning_rate
    )

    model.compile(
        optimizer=optimizer,
        loss=config.compile.loss,
        metrics=config.compile.metrics
    )

    return model


def build_model(input_dim: int):
    model = keras.Sequential([
        layers.Input(shape=(input_dim,)),
        layers.Dense(64, activation="relu"),
        layers.BatchNormalization(),
        layers.Dropout(0.3),

        layers.Dense(32, activation="relu"),
        layers.BatchNormalization(),
        layers.Dropout(0.2),

        layers.Dense(1, activation="sigmoid")
    ])

    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=LEARNING_RATE),
        loss="binary_crossentropy",
        metrics=["accuracy"]
    )

    return model