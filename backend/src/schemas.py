from typing import List, Optional, Union, Any

from pydantic import BaseModel, ConfigDict


class OptimizerConfig(BaseModel):
    type: str
    learning_rate: float


class CompileConfig(BaseModel):
    optimizer: OptimizerConfig
    loss: str
    metrics: list[str]


class LayerConfig(BaseModel):
    model_config = ConfigDict(extra="allow")
    type: str
    units: Optional[int] = None
    activation: Optional[str] = None
    rate: Optional[float] = None





class PredictionRequest(BaseModel):
    features: List[float]


class PredictionResponse(BaseModel):
    prediction: int
    probability: float


class BuildModelRequest(BaseModel):
    input_dim: int
    layers: List[LayerConfig]
    compile: CompileConfig


class BuildModelResponse(BaseModel):
    status: str
    input_dim: int
    layers_count: int


class TrainingRequest(BaseModel):
    file_name: str
    selectedFeatures: List[str]
    selectedTarget: str


class ModelParameters(BaseModel):
    input_dim: int
    layers: list[LayerConfig]
    compile: CompileConfig

class ModelParametersAndTrainingRequest(BaseModel):
    configModel: ModelParameters
    params: TrainingRequest