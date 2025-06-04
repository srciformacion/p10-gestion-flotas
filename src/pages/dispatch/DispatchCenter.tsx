
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Zap, 
  Clock, 
  MapPin, 
  CheckCircle, 
  AlertCircle,
  Ambulance,
  Route,
  Target,
  Settings,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';

interface DispatchRecommendation {
  id: string;
  requestId: string;
  patientName: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  location: string;
  recommendedAmbulance: string;
  estimatedTime: number;
  confidence: number;
  reasoning: string[];
  alternativeOptions: Array<{
    ambulanceId: string;
    estimatedTime: number;
    reasoning: string;
  }>;
}

const mockRecommendations: DispatchRecommendation[] = [
  {
    id: '1',
    requestId: 'REQ-2024-001',
    patientName: 'Juan Pérez',
    priority: 'emergency',
    location: 'Calle Gran Vía, 28, Madrid',
    recommendedAmbulance: 'AMB-001',
    estimatedTime: 8,
    confidence: 95,
    reasoning: [
      'Ambulancia más cercana (2.3 km)',
      'Especializada en emergencias cardíacas',
      'Conductor experimentado en zona urbana',
      'Tráfico favorable en ruta sugerida'
    ],
    alternativeOptions: [
      {
        ambulanceId: 'AMB-003',
        estimatedTime: 12,
        reasoning: 'Segunda opción más cercana'
      },
      {
        ambulanceId: 'AMB-002',
        estimatedTime: 15,
        reasoning: 'Disponible pero más distante'
      }
    ]
  },
  {
    id: '2',
    requestId: 'REQ-2024-002',
    patientName: 'María González',
    priority: 'high',
    location: 'Hospital Regional, Madrid',
    recommendedAmbulance: 'AMB-002',
    estimatedTime: 6,
    confidence: 88,
    reasoning: [
      'Ya se encuentra en hospital',
      'Tipo de ambulancia adecuado',
      'Personal médico especializado disponible'
    ],
    alternativeOptions: [
      {
        ambulanceId: 'AMB-004',
        estimatedTime: 10,
        reasoning: 'Disponible en base central'
      }
    ]
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'emergency': return 'bg-red-100 text-red-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'emergency': return 'EMERGENCIA';
    case 'high': return 'Alta';
    case 'medium': return 'Media';
    case 'low': return 'Baja';
    default: return priority;
  }
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 90) return 'text-green-600';
  if (confidence >= 70) return 'text-yellow-600';
  return 'text-red-600';
};

export default function DispatchCenter() {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [autoDispatch, setAutoDispatch] = useState(false);

  const handleDispatch = (recommendationId: string, ambulanceId: string) => {
    console.log(`Dispatching ${ambulanceId} for recommendation ${recommendationId}`);
    // Aquí iría la lógica de despacho
  };

  const handleRejectRecommendation = (recommendationId: string) => {
    console.log(`Rejecting recommendation ${recommendationId}`);
    // Aquí iría la lógica para rechazar la recomendación
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-rioja-blue">Centro de Despacho IA</h1>
            <p className="text-gray-600 mt-1">Sistema inteligente de asignación y despacho</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={aiEnabled ? "default" : "outline"}
              onClick={() => setAiEnabled(!aiEnabled)}
              className={aiEnabled ? "bg-rioja-green hover:bg-rioja-green/90" : ""}
            >
              <Brain className="w-4 h-4 mr-2" />
              IA {aiEnabled ? 'Activada' : 'Desactivada'}
            </Button>
            <Button 
              variant={autoDispatch ? "default" : "outline"}
              onClick={() => setAutoDispatch(!autoDispatch)}
              className={autoDispatch ? "bg-rioja-blue hover:bg-rioja-blue/90" : ""}
            >
              <Zap className="w-4 h-4 mr-2" />
              Auto-despacho
            </Button>
          </div>
        </div>

        {/* AI Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${aiEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Brain className={`w-5 h-5 ${aiEnabled ? 'text-green-600' : 'text-gray-600'}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado IA</p>
                  <p className={`text-lg font-bold ${aiEnabled ? 'text-green-600' : 'text-gray-600'}`}>
                    {aiEnabled ? 'Activa' : 'Inactiva'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Precisión</p>
                  <p className="text-lg font-bold text-blue-600">94.2%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tiempo Promedio</p>
                  <p className="text-lg font-bold text-orange-600">3.2 min</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Despachos Hoy</p>
                  <p className="text-lg font-bold text-purple-600">127</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-rioja-blue">Recomendaciones IA</h2>
            <Badge variant="outline" className="text-sm">
              {mockRecommendations.length} pendientes
            </Badge>
          </div>

          {mockRecommendations.map((recommendation) => (
            <Card key={recommendation.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-rioja-blue flex items-center gap-2">
                      {recommendation.patientName}
                      <Badge className={getPriorityColor(recommendation.priority)}>
                        {getPriorityText(recommendation.priority)}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4" />
                      {recommendation.location}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Confianza IA</p>
                    <p className={`text-lg font-bold ${getConfidenceColor(recommendation.confidence)}`}>
                      {recommendation.confidence}%
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Recommended Ambulance */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-green-900 flex items-center gap-2">
                      <Ambulance className="w-4 h-4" />
                      Recomendación Principal
                    </h4>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-900">
                        {recommendation.estimatedTime} min
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="font-medium text-green-900 mb-1">
                      {recommendation.recommendedAmbulance}
                    </p>
                    <div className="space-y-1">
                      {recommendation.reasoning.map((reason, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-green-700">
                          <CheckCircle className="w-3 h-3" />
                          {reason}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleDispatch(recommendation.id, recommendation.recommendedAmbulance)}
                      className="bg-rioja-green hover:bg-rioja-green/90 text-white flex-1"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Despachar
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleRejectRecommendation(recommendation.id)}
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Rechazar
                    </Button>
                  </div>
                </div>

                {/* Alternative Options */}
                {recommendation.alternativeOptions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Opciones Alternativas</h4>
                    <div className="space-y-2">
                      {recommendation.alternativeOptions.map((option, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{option.ambulanceId}</p>
                            <p className="text-sm text-gray-600">{option.reasoning}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-sm text-gray-600">ETA</p>
                              <p className="font-semibold">{option.estimatedTime} min</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDispatch(recommendation.id, option.ambulanceId)}
                            >
                              Seleccionar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuración del Sistema IA
            </CardTitle>
            <CardDescription>
              Ajusta los parámetros del sistema de despacho inteligente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Criterios de Priorización</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Distancia al paciente</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Tipo de especialización médica</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Condiciones de tráfico</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Experiencia del equipo</span>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Configuración Automática</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={autoDispatch}
                      onChange={(e) => setAutoDispatch(e.target.checked)}
                      className="rounded" 
                    />
                    <span className="text-sm">Despacho automático (confianza >95%)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Notificaciones en tiempo real</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Actualización continua de rutas</span>
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {!aiEnabled && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-900">Sistema IA Desactivado</p>
                  <p className="text-sm text-yellow-700">
                    El sistema de recomendaciones inteligentes está desactivado. 
                    Los despachos se realizarán manualmente.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
