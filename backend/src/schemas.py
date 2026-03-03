from typing import List, Optional

from pydantic import BaseModel


class OptimizerConfig(BaseModel):
    type: str
    learning_rate: float


class CompileConfig(BaseModel):
    optimizer: OptimizerConfig
    loss: str
    metrics: list[str]


class LayerConfig(BaseModel):
    type: str
    units: Optional[int] = None
    activation: Optional[str] = None
    rate: Optional[float] = None


class ModelParameters(BaseModel):
    input_dim: int
    layers: list[LayerConfig]
    compile: CompileConfig


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